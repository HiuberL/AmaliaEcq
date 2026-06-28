'use server'
import { ApiGeneral } from "@/interfaces/api-cliente.interface";
import { ProductoFull } from "@/interfaces/admin/producto-detalle.interface";
import { readItems } from "@directus/sdk";
import { directusPublic } from "./directus.config";

const URL_ASSET = process.env.ASSETS_URL;
const ORDEN_DESEADO = ["Sellado", "OpenBox", "10ml", "5ml", "3ml"];

const capitalizarTexto = (texto: string | undefined): string => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

const consultProducts = async (
  page: number,
  categoria: string,
  subCategoria: string,
  busqueda: string = ""
): Promise<any> => {
  try {
    const categoriaB = capitalizarTexto(categoria);
    const subCategoriaB = capitalizarTexto(subCategoria);

    const maxInfo = 9;

    // 1. NUEVA ESTRUCTURA DE FILTROS REULIZABLES
    // CORREGIDO: Como 'grupo' y 'nombre' ahora viven en la tabla 'categoria',
    // entramos a ambos campos a través de la relación 'categoria_id' desde la tabla pivote.
    const filtros: any = {
      _and: [
        {
          categoria_id: {
            grupo: {
              _eq: categoriaB
            }
          }
        },
        {
          categoria_id: {
            nombre: {
              _eq: subCategoriaB
            }
          }
        },
        {
          producto_id: {
            activo: {
              _eq: true
            }
          }
        }
      ]
    };

    // Inyectamos la búsqueda si existe
    if (busqueda && busqueda.trim() !== "") {
      filtros._and.push({
        producto_id: {
          _or: [
            {
              nombre: {
                _icontains: busqueda.trim()
              }
            },
            {
              marca: {
                _icontains: busqueda.trim()
              }
            }
          ]
        }
      });
    }

    // 2. Primera petición: Consultamos la tabla intermedia 'producto_categoria'
    const productos = await directusPublic.request(
      readItems('producto_categoria', {
        limit: maxInfo,
        offset: (page - 1) * maxInfo,
        fields: [
          {
            producto_id: [
              "id",
              "imagen",
              "nombre",
              "slug",
              "marca",
              "meta_title",
              "meta_description",
              "descuento",
              {
                variantes: [
                  "id",
                  "sku",
                  "descuento",
                  "activo",
                  {
                    atributos: [
                      "etiqueta",
                      "valor"
                    ]
                  },
                  "precio"
                ]
              }
            ]
          }
        ],
        filter: filtros
      })
    );
    // 3. Segunda petición: Conteo total dinámico respetando los nuevos filtros
    const conteoTotal: any = await directusPublic.request(
      readItems('producto_categoria', {
        aggregate: {
          count: '*'
        },
        filter: filtros
      })
    );

    // 4. Transformación de los datos
    const productosTransf = productos.map(v => {
      const producto = v.producto_id;

      if (!producto) return null;

      const variantesActivas = producto.variantes?.filter((variante: any) => variante.activo) || [];

      const precios = variantesActivas
        .map((variante: any) => parseFloat(variante.precio))
        .filter((precio: number) => precio > 0);

      const tieneDescuento = variantesActivas.some((v: any) => parseFloat(v.descuento || 0) > 0);

      let minPrecio = precios.length > 0 ? Math.min(...precios) : 0;
      let maxPrecio = precios.length > 0 ? Math.max(...precios) : 0;

      if (producto.descuento > 0) {
        minPrecio = minPrecio * (1 - producto.descuento / 100);
        maxPrecio = maxPrecio * (1 - producto.descuento / 100);
      }

      const variantes = variantesActivas.map((p: any) => {

        return {
          id: p.id,
          estado: p.activo,
          precio: p.precio,
          descuento:p.descuento,
          opciones: p.atributos || []
        }
      }).sort((a: any, b: any) => {
        const valorA = a.opciones[0]?.valor || "";
        const valorB = b.opciones[0]?.valor || "";

        let indexA = ORDEN_DESEADO.indexOf(valorA);
        let indexB = ORDEN_DESEADO.indexOf(valorB);

        if (indexA === -1) indexA = 99;
        if (indexB === -1) indexB = 99;

        return indexA - indexB;
      });

      return {
        id: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen ? `${URL_ASSET}/${producto.imagen}.webp` : null,
        slug: producto.slug,
        marca: producto.marca,
        meta: {
          title: producto.meta_title,
          description: producto.meta_description
        },
        precios: {
          minPrecio,
          maxPrecio
        },
        variantes: variantes,
        descuento_general: producto.descuento,
        etiquetaDescuento: tieneDescuento ? "Producto tiene variantes en descuento" : ""
      };
    }).filter(Boolean);

    // 5. Cálculo del total de páginas
    const totalRegistros = Array.isArray(conteoTotal)
      ? parseInt(conteoTotal[0]?.count || "0")
      : parseInt(conteoTotal?.count || "0");

    const totalPage = Math.ceil(totalRegistros / maxInfo) || 1;

    return {
      productosTransf,
      conteoTotal: totalPage
    };

  } catch (error) {
    console.error("Error consultando Directus:", error);
    return {
      productosTransf: [],
      conteoTotal: 1
    };
  }
};

const consultCategorias = async (categoria: string): Promise<any> => {
  const categoriaB = capitalizarTexto(categoria);

  const categorias = await directusPublic.request(
    readItems('categoria', {
      fields: ["nombre", "orden"],
      filter: {
        grupo: {
          _eq: categoriaB
        }
      }
    })
  );

  const filtrado: string[] = categorias.sort((a: any, b: any) => a.orden - b.orden).
    map((v: any) => {
      return v.nombre;
    });
  return filtrado || null;
};

const consultProductoEspecifico = async (slug: string): Promise<any> => {
  const producto = await directusPublic.request(
    readItems('producto', {
      fields: [
        {
          imagenes_productos: [
            "imagen",
            "is_primary"
          ]
        },
        "nombre",
        "marca",
        "descripcion",
        "descuento",
        "activo",
        {
          atributos_producto: [
            "etiqueta",
            "valor"
          ]
        },
        "meta_title",
        "meta_description",
        {
          variantes: [
            "id",
            "descripcion",
            "sku",
            "stock",
            "precio",
            "descuento",
            "activo",
            {
              atributos: [
                "etiqueta",
                "valor"
              ]
            },
            {
              control_decants: [
                "cantidad"
              ]
            }
          ]
        },
        {
          resenas: [
            "puntuacion",
            "usuario_anonimo",
            "comentario",
            "created_at"
          ]
        }
      ],

      filter: {
        slug: {
          _eq: slug
        }
      }
    })
  );
  if (!producto || producto.length === 0) return null;

  const info = producto[0];
  if (info.imagenes_productos) {
    info.imagenes_productos = info.imagenes_productos.map((item: any) => ({
      ...item,
      imagen: item.imagen? `${URL_ASSET}/${item.imagen}.webp` : null
    }));
  }
  if (info.variantes && Array.isArray(info.variantes)) {
    info.variantes.sort((a: any, b: any) => {
      // Buscamos el valor del atributo cuya etiqueta sea exactamente "Cantidad"
      const valorA = a.atributos?.find((attr: any) => attr.etiqueta === "Cantidad")?.valor;
      const valorB = b.atributos?.find((attr: any) => attr.etiqueta === "Cantidad")?.valor;

      // Obtenemos el índice en nuestro array de orden deseado
      let indexA = ORDEN_DESEADO.indexOf(valorA);
      let indexB = ORDEN_DESEADO.indexOf(valorB);

      // Si el valor no existe en ORDEN_DESEADO, indexOf devuelve -1. 
      // Lo asignamos a un número alto para que se vaya al final del combo box.
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;

      // Comparamos los índices para ordenar de menor a mayor (según tu array)
      return indexA - indexB;
    });
  }


  return info;
}

export {
  consultProducts,
  consultCategorias,
  consultProductoEspecifico
};