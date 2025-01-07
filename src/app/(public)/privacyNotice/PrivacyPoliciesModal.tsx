'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '@/utils/axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import CustomEditor from '@/components/CustomEditor';

interface PrivacyNoticeModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentNotice: string;
  setPrivacyNotice: (notice: string) => void;
}

const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  showModal,
  setShowModal,
  currentNotice,
  setPrivacyNotice,
}) => {
  const [notice, setNotice] = useState(currentNotice);
  const editorRef = useRef<any>(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.patch('/config', { privacyNotice: notice });
      setPrivacyNotice(response.data.privacyNotice);
      setShowModal(false);
      dispatch(addNotification({ message: 'Aviso de privacidad actualizado correctamente', color: 'success' }));
    } catch (error) {
      console.error('Error updating privacy notice:', error);
      dispatch(addNotification({ message: 'Error al actualizar el aviso de privacidad', color: 'danger' }));
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
        <Modal.Title>Editar Aviso de Privacidad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPrivacyNotice">
            <Form.Label>Aviso de Privacidad</Form.Label>
            <CustomEditor
              content={notice}
              setContent={setNotice}
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

export default PrivacyNoticeModal;
