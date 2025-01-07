'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '@/utils/axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import CustomEditor from '@/components/CustomEditor';

interface NormativaModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentNormative: string;
  setGeneralNormative: (normative: string) => void;
}

const NormativaModal: React.FC<NormativaModalProps> = ({
  showModal,
  setShowModal,
  currentNormative,
  setGeneralNormative,
}) => {
  const [normative, setNormative] = useState(currentNormative);
  const editorRef = useRef<any>(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.patch('/config', { generalNormative: normative });
      setGeneralNormative(response.data.generalNormative);
      setShowModal(false);
      dispatch(addNotification({ message: 'Normativa actualizada correctamente', color: 'success' }));
    } catch (error) {
      console.error('Error updating normative:', error);
      dispatch(addNotification({ message: 'Error al actualizar la normativa', color: 'danger' }));
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
        <Modal.Title>Editar Normativa General</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formGeneralNormative">
            <Form.Label>Normativa General</Form.Label>
            <CustomEditor
              content={normative}
              setContent={setNormative}
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

export default NormativaModal;
