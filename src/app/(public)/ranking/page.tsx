/* eslint-disable react-hooks/exhaustive-deps */
'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Spinner, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import api from '@/utils/axios';

interface User {
  id: string;
  username: string;
  points: number;
  coins: number;
  experience: number;
}

interface SortConfig {
  key: 'points' | 'coins' | 'experience' | null;
  direction: 'asc' | 'desc';
}

const RankingPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'experience', 
    direction: 'desc' 
  });
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      const params = {
        limit,
        offset,
        search: searchTerm.trim() || undefined,
        sortBy: sortConfig.key || 'experience',
        sortOrder: sortConfig.direction.toUpperCase(),
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
      );

      const response = await api.get('/discord-users', { params: cleanParams });
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total || 0);
      } else {
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, sortConfig]);

  const handleSort = (key: 'points' | 'coins' | 'experience') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedUsers = React.useMemo(() => {
    if (!Array.isArray(users)) return [];

    return [...users].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA === null) return 1;
      if (valueB === null) return -1;
      if (valueA === valueB) return 0;

      return valueA > valueB ? direction : -direction;
    });
  }, [users, sortConfig]);

  const totalPages = Math.ceil(totalUsers / limit);

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return '#FFD700'; // Oro
      case 1: return '#C0C0C0'; // Plata
      case 2: return '#CD7F32'; // Bronce
      default: return '#FFFFFF';
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Button
            variant={sortConfig.key === 'points' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('points')}
            className="me-2"
          >
            Ordenar por Puntos {sortConfig.key === 'points' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant={sortConfig.key === 'coins' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('coins')}
            className="me-2"
          >
            Ordenar por Monedas {sortConfig.key === 'coins' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant={sortConfig.key === 'experience' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('experience')}
          >
            Ordenar por Experiencia {sortConfig.key === 'experience' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Castigos</th>
              <th>Monedas</th>
              <th>Experiencia</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, index) => (
              <tr
                key={user.id}
                style={{ border: `2px solid ${getMedalColor(index)}` }}
              >
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.points}</td>
                <td>{user.coins}</td>
                <td>{user.experience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <span>Total: {totalUsers} usuarios</span>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <span className="mx-2">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline-primary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default RankingPage;