import './globals.css';
import { Providers } from './providers';
import ClientLayout from '@/components/ClientLayout';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafeteriadelcaos.com';

export const metadata = {
  title: {
    default: 'Cafetería del Caos | Espacio de Debates y Pensamiento Libre',
    template: '%s | Cafetería del Caos'
  },
  description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio. Debates filosóficos, políticos y sociales sin censura.',
  keywords: ['debates', 'pensamiento libre', 'filosofía', 'discusiones', 'comunidad', 'política', 'teoría crítica'],
  authors: [{ name: 'Cafetería del Caos' }],
  creator: 'Cafetería del Caos',
  publisher: 'Cafetería del Caos',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Cafetería del Caos',
    description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio.',
    url: siteUrl,
    siteName: 'Cafetería del Caos',
    images: [{
      url: '/images/logo.png',
    }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafetería del Caos',
    description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio.',
    creator: '@CafeteriaDelCaos',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#1a1a1a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
