/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Modal, Form, Spinner, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import axios from '@/utils/axios';
import { FaEdit, FaSearch, FaSort } from 'react-icons/fa';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface SortConfig {
  key: keyof User | null;
  direction: 'asc' | 'desc';
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      const params = {
        limit,
        offset,
        search: searchTerm || undefined,
      };
      const response = await axios.get('/user', { params });
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total || 0);
      } else {
        setUsers([]);
        setTotalUsers(0);
        dispatch(addNotification({ message: 'Formato de respuesta inválido', color: 'warning' }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
      dispatch(addNotification({ message: 'Error al cargar usuarios', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const handleSort = (key: keyof User) => {
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

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setRole(user.role);
    setShowModal(true);
  };

  const handleUpdateRole = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/user/${selectedUser!.id}`, { role });
      if (response.status === 200) {
        setUsers(users.map((user) => (user.id === selectedUser!.id ? { ...user, role } : user)));
        dispatch(addNotification({ message: 'Rol actualizado correctamente', color: 'success' }));
      } else {
        dispatch(addNotification({ message: 'Error al actualizar el rol', color: 'danger' }));
      }
    } catch (error) {
      console.error('Error updating role:', error);
      dispatch(addNotification({ message: 'Error al actualizar el rol', color: 'danger' }));
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <Container className="mt-5">
      <div className="table-header">
        <Row className="mb-4">
          <Col md={12}>
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
        </Row>
      </div>

      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              {['ID', 'Correo', 'Nombre', 'Rol', 'Acciones'].map((header, index) => {

                return (
                  <th
                    key={index}
                    onClick={() => header && handleSort(header as keyof User)}
                    style={{ cursor: header ? 'pointer' : 'default' }}
                  >
                    {header} {sortConfig.key === header && header && (
                      <FaSort />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : sortedUsers.length > 0 ? (
              sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.name || 'Sin nombre'}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(user)}>
                      <FaEdit /> Editar Rol
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="table-footer">
        <div className="d-flex justify-content-between align-items-center">
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
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Usuario</option>
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
                <option value="super_admin">Super Administrador</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateRole} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Actualizar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserListPage;
