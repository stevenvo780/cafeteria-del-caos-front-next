import { MetadataRoute } from 'next';
import { getDisallowedRoutes, getSeoRoutesWithoutDynamicParams } from '@/utils/seoUtils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafeteriadelcaos.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: getSeoRoutesWithoutDynamicParams()
          .filter(route => !route.seo?.robots?.includes('noindex'))
          .map(route => route.path),
        disallow: getDisallowedRoutes(),
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
