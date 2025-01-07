/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '@/utils/axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import CustomEditor from '@/components/CustomEditor';

interface AboutModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentInfo: string;
  setProjectInfo: (info: string) => void;
}

const AboutModal: React.FC<AboutModalProps> = ({
  showModal,
  setShowModal,
  currentInfo,
  setProjectInfo,
}) => {
  const [projectInfo, setInfo] = useState(currentInfo);
  const editorRef = useRef<any>(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.patch('/config', { projectInfo });
      setProjectInfo(response.data.projectInfo);
      setShowModal(false);
      dispatch(addNotification({ message: 'Información del proyecto actualizada correctamente', color: 'success' }));
    } catch (error) {
      console.error('Error updating project info:', error);
      dispatch(addNotification({ message: 'Error al actualizar la información del proyecto', color: 'danger' }));
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
        <Modal.Title>Editar Información del Proyecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProjectInfo">
            <Form.Label>Información del Proyecto</Form.Label>
            <CustomEditor
              content={projectInfo}
              setContent={setInfo}
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

export default AboutModal;
