'use client';

import React from 'react';
import { FaDiscord, FaCircle } from 'react-icons/fa';

interface DiscordButtonProps {
  inviteLink: string;
  onlineCount: number | null;
}

export default function DiscordButton({ inviteLink, onlineCount }: DiscordButtonProps) {
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
