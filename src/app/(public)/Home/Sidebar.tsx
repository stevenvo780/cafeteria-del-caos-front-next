'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import { Events, Library } from '@/utils/types';
import UpcomingEvents from './UpcomingEvents';
import LatestNotes from './LatestNotes';
import DiscordMemberCard from './DiscordMemberCard';
import TopUsers from './TopUsers';
import ProjectSocialLinks from './ProjectSocialLinks';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [latestNotes, setLatestNotes] = useState<Library[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);
  const [guildMemberCount, setGuildMemberCount] = useState<number | null>(null);

  useEffect(() => {
    fetchLatestNotes();
    fetchUniqueEvents();
    fetchGuildMemberCount();
  }, []);

  const fetchLatestNotes = async () => {
    try {
      const response = await api.get<Library[]>('/library/home/latest?limit=3');
      setLatestNotes(response.data);
    } catch (error) {
      console.error('Error fetching latest notes:', error);
      dispatch(addNotification({ message: 'Error al obtener las últimas notas', color: 'danger' }));
    }
  };

  const fetchUniqueEvents = async () => {
    try {
      const response = await api.get<Events[]>('/events/home/unique?limit=3');
      setUpcomingEvents(response.data);
    } catch (error) {
      console.error('Error fetching unique events:', error);
      dispatch(addNotification({ message: 'Error al obtener los próximos eventos', color: 'danger' }));
    }
  };

  const fetchGuildMemberCount = async () => {
    try {
      const response = await axios.get<number>(process.env.REACT_APP_API_URL + '/discord/guild/members');
      setGuildMemberCount(response.data);
    } catch (error) {
      console.error('Error fetching guild member count:', error);
      dispatch(addNotification({ message: 'Error al obtener la cantidad de miembros de Discord', color: 'danger' }));
    }
  };

  return (
    <div>
      <DiscordMemberCard guildMemberCount={guildMemberCount} />
      <UpcomingEvents events={upcomingEvents} />
      <TopUsers />
      <LatestNotes notes={latestNotes} />
      <ProjectSocialLinks />
    </div>
  );
};

export default Sidebar;
