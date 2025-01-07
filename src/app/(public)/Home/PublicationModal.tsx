/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import CustomEditor from '@/components/CustomEditor';
import { TemplateType } from '@/utils/types';

interface PublicationModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  editingPublication: any;
}

const PublicationModal: React.FC<PublicationModalProps> = ({
  showModal,
  setShowModal,
  handleSubmit,
  title,
  setTitle,
  content,
  setContent,
  editingPublication,
}) => {

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!showModal) {
      setContent('');
    }
  }, [showModal, setContent]);

  return (
    <>
      {showModal && (
        <Modal show={showModal} onHide={handleClose} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{editingPublication ? 'Editar Publicación' : 'Crear Publicación'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => {
              handleClose();
              handleSubmit(e);
            }}>
              <Form.Group controlId="formPublicationTitle">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPublicationContent">
                <Form.Label>Contenido</Form.Label>
                <CustomEditor
                  content={content}
                  setContent={setContent}
                  templateType={TemplateType.PUBLICATIONS}
                />
              </Form.Group>
              <br />
              <Button variant="primary" type="submit">
                {editingPublication ? 'Actualizar' : 'Publicar'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PublicationModal;
