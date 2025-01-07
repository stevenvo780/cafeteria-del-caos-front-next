'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Card, Row, Col, Modal, Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/auth';
import { addNotification } from '@/redux/ui';
import { auth } from '@/utils/firebase';
import firebase from 'firebase/compat/app';
import api from '@/utils/axios';
import { User } from '@/utils/types';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user && user.email) {
        const token = await user.getIdToken();
        const response = await api.get('/user/me/data', { headers: { Authorization: `Bearer ${token}` } });
        const dataUser = response.data as User;
        dispatch(login(dataUser));
        dispatch(addNotification({ message: 'Bienvenido', color: 'success' }));
        router.push('/');
      }
    } catch (error: any) {
      console.error(error?.message);
      dispatch(addNotification({ message: 'Error al iniciar sesión', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      if (user && user.email) {
        const token = await user.getIdToken();
        const response = await api.get('/user/me/data', { headers: { Authorization: `Bearer ${token}` } });
        const dataUser = response.data as User;
        dispatch(login(dataUser));
        dispatch(addNotification({ message: 'Bienvenido', color: 'success' }));
        router.push('/');
      }
    } catch (error: any) {
      console.error(error?.message);
      dispatch(addNotification({ message: 'Error al iniciar sesión con Google', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await auth.sendPasswordResetEmail(resetEmail);
      dispatch(addNotification({ message: 'Se ha enviado un correo para restablecer tu contraseña', color: 'success' }));
      setShowResetModal(false);
    } catch (error: any) {
      console.error(error?.message);
      dispatch(addNotification({ message: 'Error al enviar el correo de restablecimiento', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <h1 className="d-flex align-items-center justify-content-center" 
            style={{ 
              fontFamily: "Montaga", 
              fontSize: "3rem", 
              marginTop: "2vw",
              color: "var(--font-color)"
            }}>
          Cafeteria del caos
        </h1>
        <Col sm="6" className="d-flex align-items-center justify-content-center" style={{ marginTop: "5%" }}>
          <Image
            src="/images/login.webp"
            alt="Banner"
            fluid
            style={{
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)'
            }}
          />
        </Col>
        <Col sm="6" className="order-first order-md-last d-flex align-items-center justify-content-center" style={{ marginTop: "5%" }}>
          <Card style={{ width: '100%', padding: '20px' }}>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <br />
                <Button className="w-100 mb-2" variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                </Button>
                <Button
                  className="w-100 mb-3"
                  variant="link"
                  onClick={() => setShowResetModal(true)}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
                <Button
                  className="w-100 mb-2"
                  variant="secondary"
                  onClick={handleRegister}
                >
                  Registrarse
                </Button>
                <Button
                  className="w-100"
                  variant="outline-secondary"
                  style={{ backgroundColor: 'white', color: 'black' }}
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                >
                  {isLoading ? 'Cargando...' : 'Iniciar Sesión con Google'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Restablecer Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicResetEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleResetPassword} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar correo'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoginPage;
