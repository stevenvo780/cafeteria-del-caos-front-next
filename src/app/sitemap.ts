import { MetadataRoute } from 'next';
import { getSeoRoutesWithoutDynamicParams } from '@/utils/seoUtils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafeteriadelcaos.com';
  const routes = getSeoRoutesWithoutDynamicParams();

  return routes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.path === '/' ? 'daily' : 'weekly',
    priority: route.path === '/' ? 1.0 : 0.8
  }));
}
