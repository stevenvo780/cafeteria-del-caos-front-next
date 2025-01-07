import './globals.css';
import Header from '../components/Header';
import SEOHeaders from '../components/SEOHeaders';
import { Providers } from './providers';
import DiscordButton from '../components/DiscordButton';
import InfoAlert from '@/components/InfoAlert';

export const metadata = {
  title: 'Cafetería del Caos',
  description: 'Debates, filosofía y pensamiento crítico.',
};

async function getOnlineMembers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discord/guild/online`, {
      next: { revalidate: 60 } // revalidar cada minuto
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching online members:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const onlineMemberCount = await getOnlineMembers();

  return (
    <html lang="es">
      <body>
        <Providers>
          <SEOHeaders />
          <Header />
          <main>{children}</main>
          <DiscordButton 
            inviteLink={process.env.NEXT_PUBLIC_DISCORD_TL_INVITE!}
            onlineCount={onlineMemberCount}
          />
          <InfoAlert />
        </Providers>
      </body>
    </html>
  );
}
