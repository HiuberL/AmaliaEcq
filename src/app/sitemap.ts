import { consultAllBlogs } from '@/services/blog.service';
import { consultProducts } from '@/services/producto.service';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 

  // 1. Páginas estáticas de tu sitio
  const paginasEstaticas = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/citas`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solicitudes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sorteo/juegaygana`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tienda/perfumes`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tienda/maquillajes`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica/politica-reembolso`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica/politica-envio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica/declaracion-accesibilidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica/terminos-condiciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
];

  // 2. Páginas dinámicas (ej. Productos desde Directus / API)
  // Puedes hacer un fetch a tus productos para incluir cada uno en el sitemap
  let paginasProductos: MetadataRoute.Sitemap = [];

  try {
    const res = await consultProducts(0,'Perfumes','Perfumes','',1000);

    paginasProductos = res.productosTransf.map((producto: any) => ({
      url: `${baseUrl}/productos/${producto.slug}`,
      lastModified: new Date(producto.updated_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generando sitemap para productos:', error);
  }

  let paginasMaquillajes: MetadataRoute.Sitemap = [];

  try {
    const res = await consultProducts(0,'Maquillajes','Maquillajes','',1000);

    paginasMaquillajes = res.productosTransf.map((producto: any) => ({
      url: `${baseUrl}/productos/${producto.slug}`,
      lastModified: new Date(producto.updated_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generando sitemap para productos:', error);
  }


  let paginasBlogs: MetadataRoute.Sitemap = [];

  try {
    const res = await consultAllBlogs();

    paginasBlogs = res.map((producto: any) => ({
      url: `${baseUrl}/blog/${producto.slug}`,
      lastModified: new Date(producto.date_created || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generando sitemap para productos:', error);
  }

  

  return [...paginasEstaticas, ...paginasProductos, ...paginasMaquillajes, ...paginasBlogs];
}