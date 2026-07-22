import { consultAllBlogs } from '@/services/blog.service';
import { consultProducts } from '@/services/producto.service';
import { MetadataRoute } from 'next';

// 🔄 Revalida el sitemap cada 24 horas (86400 segundos)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amaliaecq.com';

  // 1. Páginas estáticas principales
  const paginasEstaticas: MetadataRoute.Sitemap = [
    '',
    '/nosotros',
    '/citas',
    '/solicitudes',
    '/blog',
    '/sorteo/juegaygana',
    '/tienda/perfumes',
    '/tienda/maquillajes',
    '/faq',
    '/politica/politica-reembolso',
    '/politica/politica-envio',
    '/politica/declaracion-accesibilidad',
    '/politica/terminos-condiciones',
    '/politica/politica-privacidad',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : route.includes('/tienda') ? 0.8 : 0.5,
  }));

  // 2. Consulta paralela con Promise.allSettled para evitar que un fallo bloquee a los demás
  const [perfumesRes, maquillajesRes, blogsRes] = await Promise.allSettled([
    consultProducts(1, 'Perfumes', 'Perfumes', '', 1000),
    consultProducts(1, 'Maquillajes', 'Maquillajes', '', 1000),
    consultAllBlogs(),
  ]);

  // Map para evitar URLs duplicadas
  const productosMap = new Map<string, MetadataRoute.Sitemap[number]>();

  // Procesar Perfumes
  if (perfumesRes.status === 'fulfilled' && perfumesRes.value?.productosTransf) {
    perfumesRes.value.productosTransf.forEach((prod: any) => {
      if (prod.slug) {
        productosMap.set(prod.slug, {
          url: `${baseUrl}/productos/${prod.slug}`,
          lastModified: new Date(prod.updated_at || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  }

  // Procesar Maquillajes
  if (maquillajesRes.status === 'fulfilled' && maquillajesRes.value?.productosTransf) {
    maquillajesRes.value.productosTransf.forEach((prod: any) => {
      if (prod.slug) {
        productosMap.set(prod.slug, {
          url: `${baseUrl}/productos/${prod.slug}`,
          lastModified: new Date(prod.updated_at || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  }

  // Procesar Blogs
  const paginasBlogs: MetadataRoute.Sitemap = [];
  if (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value)) {
    blogsRes.value.forEach((blog: any) => {
      if (blog.slug) {
        paginasBlogs.push({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: new Date(blog.date_created || blog.date_updated || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    });
  }

  // 3. Unificar todo en una lista limpia
  return [
    ...paginasEstaticas,
    ...Array.from(productosMap.values()),
    ...paginasBlogs,
  ];
}