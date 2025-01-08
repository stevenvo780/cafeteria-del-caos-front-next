'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, InputGroup, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addNotification } from '@/redux/ui';
import { auth } from '@/utils/firebase';
import firebase from 'firebase/compat/app';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '', name: '', acceptPolicies: '' });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const formErrors = { email: '', password: '', confirmPassword: '', name: '', acceptPolicies: '' };

    if (!validateEmail(email)) {
      formErrors.email = 'Formato de correo electrónico inválido';
    }

    if (password.length < 8) {
      formErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!name) {
      formErrors.name = 'El nombre es obligatorio';
    }

    if (!acceptPolicies) {
      formErrors.acceptPolicies = 'Debes aceptar las políticas de privacidad';
    }

    if (formErrors.email || formErrors.password || formErrors.confirmPassword || formErrors.name || formErrors.acceptPolicies) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user && user.email) {
        await user.updateProfile({ displayName: name });
        dispatch(addNotification({ message: 'Registro exitoso', color: 'success' }));
        navigate('/Login');
      }
    } catch (error: any) {
      dispatch(addNotification({ message: error?.message || 'El registro ha fallado', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      if (user && user.email) {
        dispatch(addNotification({ message: 'Registro con Google exitoso', color: 'success' }));
        navigate('/');
      }
    } catch (error: any) {
      console.error(error?.message);
      dispatch(addNotification({ message: 'Error al registrarse con Google', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={12}>
          <h1 className="text-center mb-4" style={{ fontFamily: "Montaga", fontSize: "4rem"}}>Regístrate</h1>
          <Card className="shadow-lg" style={{ maxWidth: '40vw', margin: '0 auto' }}>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      isInvalid={!!errors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicEmail">
                  <InputGroup>
                    <Form.Control
                      type="email"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={!!errors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicPassword">
                  <InputGroup>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errors.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicConfirmPassword">
                  <InputGroup>
                    <Form.Control
                      type="password"
                      placeholder="Confirma tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isInvalid={!!errors.confirmPassword}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicAcceptPolicies">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        Acepto las{' '}
                        <Link to="/privacy" target="_blank">
                          Políticas de Privacidad
                        </Link>
                      </>
                    }
                    checked={acceptPolicies}
                    onChange={(e) => setAcceptPolicies(e.target.checked)}
                    isInvalid={!!errors.acceptPolicies}
                    feedback={errors.acceptPolicies}
                    required
                  />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Registrar'}
                </Button>
                <br />
                <Button variant="secondary" className="w-100 mt-2" onClick={signInWithGoogle} disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Registrar con Google'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
