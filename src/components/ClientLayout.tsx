'use client';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import DiscordButton from './DiscordButton';
import InfoAlert from './InfoAlert';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <Header />
      <main>{children}</main>
      <DiscordButton 
        inviteLink={process.env.NEXT_PUBLIC_DISCORD_TL_INVITE!}
      />
      <InfoAlert />
    </BrowserRouter>
  );
};

export default ClientLayout;
