'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Form, Spinner, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import api from '@/utils/axios';
import { FaSearch, FaCoins, FaStar, FaMinusCircle, FaCopy } from 'react-icons/fa';

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

interface User {
  id: string;
  username: string;
  nickname: string | null;
  email: string;
  name: string | null;
  role: UserRole;
  points: number;
  coins: number;
  experience: number;
  discordData: any;
}

interface EditingUser {
  points: string;
  experience: string;
  coins: string;
}

interface SortConfig {
  key: 'points' | 'coins' | 'experience' | null;
  direction: 'asc' | 'desc';
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPoints, setMinPoints] = useState<string>('');
  const [maxPoints, setMaxPoints] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;
  const dispatch = useDispatch();
  const [editingUsers, setEditingUsers] = useState<{ [key: string]: EditingUser }>({});
  const [savingChanges, setSavingChanges] = useState<{ [key: string]: boolean }>({});
  const [hasChanges, setHasChanges] = useState<{ [key: string]: boolean }>({});

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      const params = {
        limit,
        offset,
        search: searchTerm.trim() || undefined,
        minPoints: minPoints ? parseInt(minPoints) : undefined,
        maxPoints: maxPoints ? parseInt(maxPoints) : undefined,
        sortBy: sortConfig.key || 'points',
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
        dispatch(addNotification({ 
          message: 'Formato de respuesta inválido', 
          color: 'warning' 
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
      dispatch(addNotification({ 
        message: 'Error al cargar usuarios', 
        color: 'danger' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, minPoints, maxPoints, sortConfig]);

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

  const handleValueChange = (userId: string, field: keyof EditingUser, value: string) => {
    setEditingUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
    setHasChanges(prev => ({ ...prev, [userId]: true }));
  };

  const handleSaveChanges = async (user: User) => {
    setSavingChanges(prev => ({ ...prev, [user.id]: true }));
    try {
      const changes = editingUsers[user.id];
      
      // Actualizar usuario (puntos y experiencia)
      await api.patch(`/discord-users/${user.id}`, {
        points: parseInt(changes.points),
        experience: parseInt(changes.experience)
      });

      // Si cambiaron las monedas, ajustar balance mediante kardex
      const newCoins = parseInt(changes.coins);
      if (newCoins !== user.coins) {
        const endpoint = newCoins > user.coins ? 'cash-in' : 'cash-out';
        await api.post(`/kardex/${endpoint}/${user.id}`, {
          targetBalance: newCoins,
          reference: 'Admin balance adjustment'
        });
      }
      
      fetchUsers();
      setHasChanges(prev => ({ ...prev, [user.id]: false }));
      dispatch(addNotification({ 
        message: 'Valores actualizados correctamente', 
        color: 'success' 
      }));
    } catch (error) {
      console.error('Error updating user values:', error);
      dispatch(addNotification({ 
        message: 'Error al actualizar los valores', 
        color: 'danger' 
      }));
    } finally {
      setSavingChanges(prev => ({ ...prev, [user.id]: false }));
    }
  };

  useEffect(() => {
    const newEditingUsers: { [key: string]: EditingUser } = {};
    users.forEach(user => {
      newEditingUsers[user.id] = {
        points: user.points.toString(),
        coins: user.coins.toString(),
        experience: user.experience.toString(),
      };
    });
    setEditingUsers(newEditingUsers);
  }, [users]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    dispatch(addNotification({ 
      message: 'ID copiado al portapapeles', 
      color: 'success' 
    }));
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre o email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Row>
            <Col>
              <Form.Control
                type="number"
                placeholder="Puntos mínimos"
                value={minPoints}
                onChange={(e) => setMinPoints(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Puntos máximos"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
              />
            </Col>
          </Row>
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
        <Row xs={1} md={3} lg={4} className="g-3">
          {sortedUsers.map((user) => (
            <Col key={user.id}>
              <Card className="h-100">
                <Card.Header className="py-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="text-truncate me-2">
                      <div className="h6 mb-0">{user.username}</div>
                      <small className="text-muted user-select-all">{user.id}</small>
                    </div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleCopyId(user.id)}
                      className="px-2 py-1"
                      title="Copiar ID de Discord"
                    >
                      <FaCopy />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-3">
                  <div className="mb-3">
                    <div className="mb-2">
                      <label className="form-label d-flex align-items-center mb-1">
                        <FaMinusCircle className="text-danger me-2" />
                        <span className="fw-bold small">Penalización</span>
                      </label>
                      <Form.Control
                        type="number"
                        value={editingUsers[user.id]?.points}
                        onChange={(e) => handleValueChange(user.id, 'points', e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="form-label d-flex align-items-center mb-1">
                        <FaStar className="text-warning me-2" />
                        <span className="fw-bold small">Experiencia</span>
                      </label>
                      <Form.Control
                        type="number"
                        value={editingUsers[user.id]?.experience}
                        onChange={(e) => handleValueChange(user.id, 'experience', e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="form-label d-flex align-items-center mb-1">
                        <FaCoins className="text-warning me-2" />
                        <span className="fw-bold small">Monedas</span>
                      </label>
                      <Form.Control
                        type="number"
                        value={editingUsers[user.id]?.coins}
                        onChange={(e) => handleValueChange(user.id, 'coins', e.target.value)}
                        size="sm"
                      />
                    </div>
                  </div>
                  {savingChanges[user.id] ? (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    <Button
                      variant={hasChanges[user.id] ? "primary" : "outline-secondary"}
                      disabled={!hasChanges[user.id]}
                      onClick={() => handleSaveChanges(user)}
                      className="w-100"
                      size="sm"
                    >
                      {hasChanges[user.id] ? "Guardar" : "Sin cambios"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
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

export default UserListPage;
