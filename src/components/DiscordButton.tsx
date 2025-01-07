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
      if (data && typeof data === 'number') {
        setOnlineCount(data);
      }
    });
  }, []);
  
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--discord-text)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'transform 0.2s ease',
        textDecoration: 'none',
        gap: '2px',
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <FaDiscord size={36} color="white" />
      {onlineCount !== null && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '20px',
          color: 'white',
          gap: '3px'
        }}>
          <span>{formatNumber(onlineCount)}</span>
          <FaCircle size={8} color="#3ba55c" />
        </div>
      )}
    </a>
  );
}
