'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { FaTrophy, FaCoins, FaStar } from 'react-icons/fa';
import './TopUsers.css';

interface DiscordUser {
  id: string;
  username: string;
  coins: number;
  experience: number;
}

const TopUsers: React.FC = () => {
  const [users, setUsers] = useState<DiscordUser[]>([]);

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const fetchTopUsers = async () => {
    try {
      const response = await api.get<DiscordUser[]>('/discord-users/top?limit=3');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener top de usuarios:', error);
    }
  };

  const getCardStyle = (index: number) => {
    if (index === 0) return 'user-card gold';
    if (index === 1) return 'user-card silver';
    if (index === 2) return 'user-card bronze';
    return 'user-card default';
  };

  return (
    <div className="top-users-container">
      <h5 className="top-users-title">
        <FaTrophy className="title-icon" />
        Top Usuarios
      </h5>
      
      {users.map((user, index) => (
        <div key={user.id} className={getCardStyle(index)}>
          <div className="user-card-content">
            <div className="user-card-header">
              <span className="rank">#{index + 1}</span>
              <span className="username">{user.username}</span>
            </div>
            <div className="user-card-stats">
              <div className="stat-item">
                <FaStar className="stat-icon experience-icon" />
                <span className="stat-value">{user.experience}</span>
              </div>
              <div className="stat-item">
                <FaCoins className="stat-icon coin-icon" />
                <span className="stat-value">{user.coins}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopUsers;
