'use client';

import React from 'react';
import { FaDiscord, FaCircle } from 'react-icons/fa';

interface DiscordButtonProps {
  inviteLink: string;
}
async function getOnlineMembers() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('API URL no definida');
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discord/guild/online`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching online members:', error);
    return null;
  }
}

export default function DiscordButton({ inviteLink }: DiscordButtonProps) {
  
  const [onlineCount, setOnlineCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    getOnlineMembers().then((data) => {
      if (data) {
        setOnlineCount(data.online);
      }
    });
  }, []);
  
  return (
    <>
      <a
        href={inviteLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'var(--discord-color)',
          borderRadius: '50%',
          width: '76px',
          height: '76px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--discord-text)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          zIndex: 1000,
          flexDirection: 'column',
          padding: '10px',
        }}
      ></a>
      <FaDiscord size={48} color="var(--discord-text)" />
      {onlineCount !== null && (
        <span style={{ color: 'var(--discord-text)', fontSize: '18px' }}>
          {onlineCount}{' '}
          <FaCircle
            size={15}
            color="var(--online-color)"
            style={{ marginInline: 1 }}
          />
        </span>
      )}
    </>
  );
}
