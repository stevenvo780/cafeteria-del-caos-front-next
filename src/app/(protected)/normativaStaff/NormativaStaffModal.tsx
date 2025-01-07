/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '@/utils/axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/ui';
import CustomEditor from '@/components/CustomEditor';

interface StaffNormativeModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentNormative: string;
  setStaffNormative: (normative: string) => void;
}

const StaffNormativeModal: React.FC<StaffNormativeModalProps> = ({
  showModal,
  setShowModal,
  currentNormative,
  setStaffNormative,
}) => {
  const [normative, setNormative] = useState(currentNormative);
  const editorRef = useRef<any>(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.patch('/config', { staffNormative: normative });
      setStaffNormative(response.data.staffNormative);
      setShowModal(false);
      dispatch(addNotification({ message: 'Normativa del staff actualizada correctamente', color: 'success' }));
    } catch (error) {
      console.error('Error updating staff normative:', error);
      dispatch(addNotification({ message: 'Error al actualizar la normativa del staff', color: 'danger' }));
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
        <Modal.Title>Editar Normativa del Staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formStaffNormative">
            <Form.Label>Normativa del Staff</Form.Label>
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

export default StaffNormativeModal;
