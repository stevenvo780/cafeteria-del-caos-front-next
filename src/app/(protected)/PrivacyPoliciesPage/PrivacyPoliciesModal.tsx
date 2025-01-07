'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '@/utils/axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import CustomEditor from '@/components/CustomEditor';

interface PrivacyPoliciesModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentPolicies: string;
  setPrivacyPolicies: (policies: string) => void;
}

const PrivacyPoliciesModal: React.FC<PrivacyPoliciesModalProps> = ({
  showModal,
  setShowModal,
  currentPolicies,
  setPrivacyPolicies,
}) => {
  const [policies, setPolicies] = useState(currentPolicies);
  const editorRef = useRef<any>(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.patch('/config', { privacyPolicies: policies });
      setPrivacyPolicies(response.data.privacyPolicies);
      setShowModal(false);
      dispatch(addNotification({ message: 'Políticas de privacidad actualizadas correctamente', color: 'success' }));
    } catch (error) {
      console.error('Error updating privacy policies:', error);
      dispatch(addNotification({ message: 'Error al actualizar las políticas de privacidad', color: 'danger' }));
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!showModal && editorRef.current) {
      editorRef.current.setContent('');
    }
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Editar Políticas de Privacidad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPrivacyPolicies">
            <Form.Label>Políticas de Privacidad</Form.Label>
            <CustomEditor
              content={policies}
              setContent={setPolicies}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PrivacyPoliciesModal;
