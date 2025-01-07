'use client';
import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import CustomEditor from '@/components/CustomEditor';
import { TemplateType } from '@/utils/types';

interface TemplateEditModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  content: string;
  setContent: (content: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  isEditing: boolean;
  title: string;
  setTitle: (title: string) => void;
  type: TemplateType;
  setType: (type: TemplateType) => void;
}

const TemplateEditModal: React.FC<TemplateEditModalProps> = ({
  showModal,
  setShowModal,
  content,
  setContent,
  handleSubmit,
  isLoading,
  isEditing,
  title,
  setTitle,
  type,
  setType,
}) => {
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Plantilla' : 'Crear Plantilla'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="templateTitle" className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              id="templateTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="templateType" className="form-label">Tipo</label>
            <select
              className="form-control"
              id="templateType"
              value={type}
              onChange={(e) => setType(e.target.value as TemplateType)}
            >
              <option value={TemplateType.NOTES}>Notas</option>
              <option value={TemplateType.EVENTS}>Eventos</option>
              <option value={TemplateType.PUBLICATIONS}>Publicaciones</option>
              <option value={TemplateType.OTHERS}>Otros</option>
            </select>
          </div>
          <CustomEditor content={content} setContent={setContent} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TemplateEditModal;
