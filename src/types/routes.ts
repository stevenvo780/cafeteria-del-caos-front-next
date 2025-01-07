export interface SEOMetadata {
  title: string;
  description: string;
  image?: string;
  keywords: string;
  type: string;
  robots?: string;
}

export interface RouteConfig {
  path: string;
  element: string;
  name: string;
  viewHeader: boolean;
  hidden: boolean;
  seo: SEOMetadata;
}
