import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Providers } from './providers';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';
import './styles.css';

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
      width: 800,
      height: 600,
      alt: 'Logo de Cafetería del Caos',
    }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafetería del Caos',
    description: 'Comunidad de debate y pensamiento libre donde las ideas más radicales encuentran su espacio.',
    creator: '@CafeteriaDelCaos',
    images: [{
      url: '/images/logo.png',
      alt: 'Logo de Cafetería del Caos',
    }],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <Providers>
          <ClientLayout>
            <div style={{ marginTop: '1rem' }}>
              {children}
            </div>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
