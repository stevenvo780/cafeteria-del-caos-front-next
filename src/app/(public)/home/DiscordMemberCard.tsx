'use client';
import React from 'react';
import { Card } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';

type DiscordMemberCardProps = {
  guildMemberCount: number | null;
};

const DiscordMemberCard: React.FC<DiscordMemberCardProps> = ({ guildMemberCount }) => {
  const discordInviteLink = process.env.NEXT_PUBLIC_DISCORD_TL_INVITE as string;
  return (
    <a
      href={discordInviteLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        cursor: 'pointer',
      }}
    >
      <Card style={{ marginBlock: 10, textAlign: 'center', backgroundColor: 'var(--discord-color)', borderColor: 'var(--discord-color)' }}>
        <Card.Body style={{ padding: 7, margin: 5, paddingTop: 5 }}>
          <Card.Text style={{ fontSize: '1.5rem', color: 'var(--discord-text)' }}>
            <div style={{ padding: 0, margin: 0, fontWeight: 'bold' }}>¡YA SOMOS!</div>
            <div style={{ padding: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaUsers size={30} color="var(--discord-text)" style={{ marginInline: 5 }} />  
              {guildMemberCount !== null ? guildMemberCount : 'Cargando...'}
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </a>
  );
};

export default DiscordMemberCard;
