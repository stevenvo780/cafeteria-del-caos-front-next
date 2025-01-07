'use client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import routesConfig from '../config/routesConfig.json';
import { SEOMetadata, RouteConfig } from '../types/routes';


const SEOHeaders: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://cafeteriadelcaos.com';
  const siteName = 'Cafetería del Caos';

  const findRouteSEO = (): SEOMetadata => {
    const allRoutes = [
      ...routesConfig.publicRoutes,
      ...Object.values(routesConfig.roleRoutes).flat()
    ] as RouteConfig[];

    const route = allRoutes.find(r => {
      const routePath = r.path.split(':')[0];
      return currentPath.startsWith(routePath);
    });
    
    if (!route?.seo) {
      console.warn(`No SEO metadata found for route: ${currentPath}`);
    }

    return route?.seo || {
      title: 'Cafetería del Caos | Espacio de Debates y Pensamiento Libre',
      description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio. Debates filosóficos, políticos y sociales sin censura.',
      image: '/images/logo.png',
      keywords: 'debates, pensamiento libre, filosofía, discusiones, comunidad, caos organizado, cafetería del caos, política, anarquismo, socialismo, capitalismo, marxismo, liberalismo, libertarianismo, teoría crítica, nihilismo, existencialismo, posmodernismo, dialéctica, argumentación, lógica, retórica, epistemología, metafísica, ética, moral, teoría política, pensamiento radical, filosofía contemporánea, debate político, debate filosófico, pensamiento crítico, teoría social, ideología, revolución, contracultura, disidencia, activismo intelectual, pensamiento alternativo, discurso crítico',
      type: 'website',
      robots: 'index, follow'
    };
  };

  const seo = findRouteSEO();
  const canonicalUrl = `${siteUrl}${currentPath}`;

  return (
    <Helmet>
      {/* Básicos */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      {seo.image && <meta property="og:image" content={`${siteUrl}${seo.image}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@CafeteriaDelCaos" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image && <meta name="twitter:image" content={`${siteUrl}${seo.image}`} />}

      {/* Adicionales */}
      {seo.robots ? (
        <meta name="robots" content={seo.robots} />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <meta name="author" content="Cafetería del Caos" />
      <meta name="publisher" content="Cafetería del Caos" />
      <meta name="theme-color" content="#1a1a1a" />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type":
            seo.type === 'article'
              ? 'Article'
              : seo.type === 'event' || seo.type === 'events'
              ? 'Event'
              : 'WebSite',
          "name": seo.title,
          "description": seo.description,
          "url": canonicalUrl,
          "image": seo.image ? `${siteUrl}${seo.image}` : undefined,
          "author": {
            "@type": "Organization",
            "name": siteName
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHeaders;
