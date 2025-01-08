'use client';
import React from 'react';
import { Events, Library } from '@/utils/types';
import UpcomingEvents from './UpcomingEvents';
import LatestNotes from './LatestNotes';
import DiscordMemberCard from './DiscordMemberCard';
import TopUsers from './TopUsers';
import ProjectSocialLinks from './ProjectSocialLinks';

interface SidebarProps {
  initialUniqueEvents: Events[];
  initialLatestNotes: Library[];
  initialGuildMemberCount: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  initialUniqueEvents,
  initialLatestNotes,
  initialGuildMemberCount
}) => {
  return (
    <div>
      <DiscordMemberCard guildMemberCount={initialGuildMemberCount} />
      <UpcomingEvents events={initialUniqueEvents} />
      <TopUsers />
      <LatestNotes notes={initialLatestNotes} />
      <ProjectSocialLinks />
    </div>
  );
};

export default Sidebar;
