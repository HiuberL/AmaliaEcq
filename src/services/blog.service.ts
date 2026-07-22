'use server'

import { readItems } from "@directus/sdk";
import { directusPublic } from "./directus.config";


const URL_ASSET = process.env.ASSETS_URL;

export const consultBlogs = async (
    page: number,
    categoria: string = "",
    busqueda: string = ""
) => {
    const maxInfo = 9;
    const filtros: any = {
        _and: [
        ]
    };


    if (busqueda && busqueda.trim() !== "") {
        filtros._and.push({
            titulo: {
                _icontains: busqueda.trim()
            }
        });
    }

    const conteoTotal: any = await directusPublic.request(
        readItems('Blog', {
            aggregate: {
                count: '*'
            },
            filter: filtros
        })
    );

    const blogInformacion = await directusPublic.request(
        readItems('Blog', {
            limit: maxInfo,
            offset: (page - 1) * maxInfo,
            fields: [
                'id',
                'imagen_principal',
                'titulo',
                'slug',
                'categoria',
                'cuerpo',
                'date_created'
            ],
            filter: filtros,
            sort: ['-date_created']
        })
    );
    const blogsFiltrados = blogInformacion.filter((blog: any) => {

        if (!blog.categoria || !Array.isArray(blog.categoria)) return false;

        return blog.categoria.some((cat: string) =>
            cat.includes(categoria.trim())
        );
    });
    const totalRegistros = Array.isArray(conteoTotal)
        ? parseInt(conteoTotal[0]?.count || "0")
        : parseInt(conteoTotal?.count || "0");

    const totalPage = Math.ceil(totalRegistros / maxInfo) || 1;

    return {
        total: totalPage,
        informacion: blogsFiltrados.map(v => {
            return {
                ...v,
                imagen: v.imagen_principal ? `${URL_ASSET}/${v.imagen_principal}.webp` : null
            }
        })
    }
}


export const consultAllBlogs = async () => {

    const blogInformacion = await directusPublic.request(
        readItems('Blog', {
            fields: [
                'id',
                'imagen_principal',
                'titulo',
                'slug',
                'categoria',
                'cuerpo',
                'date_created'
            ]
        })
    );

    return blogInformacion;
}



export const consultBlogBySlug = async (slug: string) => {
    const filtros: any = {
        _and: [
            {
                slug: {
                    _icontains: slug
                }
            },
        ]
    };
    const blogInformacion = await directusPublic.request(
        readItems('Blog', {
            fields: [
                'id',
                'imagen_principal',
                'titulo',
                'slug',
                'categoria',
                'cuerpo',
                'meta_title',
                'meta_description',
                'date_created'
            ],
            filter: filtros
        })
    );

    const response = blogInformacion.map(v => {
        return {
            ...v,
            imagen_principal: v.imagen_principal ? `${URL_ASSET}/${v.imagen_principal}.webp` : null
        }
    });
    return response.length > 0 ? response[0] : null;
}

export const consultCategoriasBlog = async () => {
    const blogs = await directusPublic.request(
        readItems('Blog', {
            fields: ['categoria']
        })
    );
    const categorias = [
        ...new Set(
            blogs.flatMap(blog => blog.categoria ?? [])
        )
    ];

    return categorias;

}