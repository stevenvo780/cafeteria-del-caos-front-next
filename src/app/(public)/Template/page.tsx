'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getTemplates, updateTemplate, addTemplate, deleteTemplate } from '@/redux/templates';
import { addNotification } from '@/redux/ui';
import api from '@/utils/axios';
import TemplateEditModal from './TemplateEditModal';
import { TemplateType, Template } from '@/utils/types';

const TemplatePage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState(TemplateType.NOTES);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const templates = useSelector((state: RootState) => state.templates.templates);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/template');
        dispatch(getTemplates(response.data));
      } catch (error) {
        console.error('Error fetching templates:', error);
        dispatch(addNotification({ message: 'Error al cargar plantillas', color: 'danger' }));
      }
    };

    fetchTemplates();
  }, [dispatch]);

  const handleCreateClick = () => {
    setSelectedTemplate(null);
    setTitle('');
    setContent('');
    setType(TemplateType.NOTES);
    setIsEditing(false);
    setShowEditModal(true);
  };

  const handleEditClick = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.name);
    setContent(template.content);
    setType(template.type);
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!title || !content) {
      dispatch(addNotification({ message: 'El título y el contenido son obligatorios', color: 'danger' }));
      setIsLoading(false);
      return;
    }

    try {
      if (isEditing) {
        if (selectedTemplate) {
          const response = await api.patch(`/template/${selectedTemplate.id}`, { name: title, content, type });
          if (response.status === 200) {
            dispatch(updateTemplate({ ...selectedTemplate, name: title, content, type }));
            dispatch(addNotification({ message: 'Plantilla actualizada correctamente', color: 'success' }));
          } else {
            dispatch(addNotification({ message: 'Error al actualizar la plantilla', color: 'danger' }));
          }
        }
      } else {
        const response = await api.post('/template', { name: title, content, type });
        if (response.status === 201) {
          dispatch(addTemplate(response.data));
          dispatch(addNotification({ message: 'Plantilla creada correctamente', color: 'success' }));
        } else {
          dispatch(addNotification({ message: 'Error al crear la plantilla', color: 'danger' }));
        }
      }
    } catch (error) {
      console.error('Error saving template:', error);
      dispatch(addNotification({ message: 'Error al procesar la solicitud', color: 'danger' }));
    } finally {
      setIsLoading(false);
      setShowEditModal(false);
    }
  };

  const handleDeleteClick = async (templateId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      try {
        const response = await api.delete(`/template/${templateId}`);
        if (response.status === 200) {
          dispatch(deleteTemplate(templateId));
          dispatch(addNotification({ message: 'Plantilla eliminada correctamente', color: 'success' }));
        } else {
          dispatch(addNotification({ message: 'Error al eliminar la plantilla', color: 'danger' }));
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        dispatch(addNotification({ message: 'Error al eliminar la plantilla', color: 'danger' }));
      }
    }
  };

  const handlePreviewClick = (template: any) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col className="text-center">
          <Button variant="success" onClick={handleCreateClick}>
            Crear Nueva Plantilla
          </Button>
        </Col>
      </Row>
      <Row>
        {templates.map((template) => (
          <Col key={template.id} md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{template.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{template.type}</Card.Subtitle>
                <Button variant="secondary" size="sm" onClick={() => handleEditClick(template)}>
                  Editar
                </Button>
                <Button className="mx-2" variant="secondary" size="sm" onClick={() => handlePreviewClick(template)}>
                  Previsualizar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDeleteClick(template.id)}>
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <TemplateEditModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        content={content}
        setContent={setContent}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isEditing={isEditing}
        title={title}
        setTitle={setTitle}
        type={type}
        setType={setType}
      />

      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Previsualización de Plantilla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTemplate && (
            <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TemplatePage;
