
export interface Valores {
  valor: string;
  etiqueta: string;
}

export interface Variante {
  sku: string;
  activo: boolean;
  precio: number;
  stock: number;
  atributos: Valores[] | null;
  createdAt: string;
  updatedAt: string;
  descuento: number;
  costo: number;
}

export interface ProductoFull {
  nombre: string;
  descripcion: string | null;
  sku: string | null;
  marca: string | null;
  atributos: Valores[] | null;
  descuento: number;
  imagen: string;
  activo: boolean;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  variantes: Variante[];
  productVariantImage: ProductVariantImage[];
}



export interface ProductVariantImage{
  id: string | null; 
  imageUrl: string;
  isPrimary: boolean; 
}