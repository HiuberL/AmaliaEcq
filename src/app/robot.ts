import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Rutas que no quieres que Google indexe
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}