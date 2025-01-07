/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Events, Repetition } from '../utils/types';
import api from '../utils/axios';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../redux/events';
import { addNotification } from '../redux/ui';
import { TemplateType } from '../utils/types';
import moment from 'moment';
import CustomEditor from '../components/CustomEditor';

interface EventModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedEvent: Events | null;
  fetchEvents: () => void;
  isEditing: boolean;
}

const EventModal: React.FC<EventModalProps> = ({
  showModal,
  setShowModal,
  selectedEvent,
  fetchEvents,
  isEditing,
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [repetition, setRepetition] = useState<Repetition>(Repetition.NONE);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
      const start = new Date(selectedEvent.startDate);
      const end = selectedEvent.endDate ? new Date(selectedEvent.endDate) : new Date(start.getTime() + 3 * 60 * 60 * 1000);
      setStartDate(start);
      setEndDate(end);
      setRepetition(selectedEvent.repetition || Repetition.NONE);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (startDate) {
      setEndDate(new Date(startDate.getTime() + 3 * 60 * 60 * 1000));
    }
  }, [startDate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const currentDate = new Date();

    if ( (selectedEvent && selectedEvent.repetition === Repetition.NONE) && (startDate && startDate < currentDate)) {
      dispatch(addNotification({ message: 'La fecha de inicio no puede ser anterior a la fecha actual', color: 'danger' }));
      return;
    }

    if (endDate && startDate && endDate < startDate) {
      dispatch(addNotification({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio', color: 'danger' }));
      return;
    }

    try {
      const eventData = {
        ...selectedEvent,
        title,
        description,
        startDate: moment(startDate!).utc().format(),
        endDate: moment(endDate!).utc().format(),
        repetition,
      } as unknown as Events;
      if (isEditing && selectedEvent && selectedEvent.id !== null) {

        await api.patch(`/events/${selectedEvent.id}`, eventData);
        dispatch(updateEvent(eventData));
        dispatch(addNotification({ message: 'Evento actualizado correctamente', color: 'success' }));
      } else {

        const response = await api.post('/events', eventData);
        dispatch(addEvent(response.data));
        dispatch(addNotification({ message: 'Evento creado correctamente', color: 'success' }));
      }
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      dispatch(addNotification({ message: 'Error al guardar el evento', color: 'danger' }));
    }
  };

  const handleDelete = async () => {
    if (selectedEvent && selectedEvent.id !== null) {
      try {
        await api.delete(`/events/${selectedEvent.id}`);
        dispatch(deleteEvent(selectedEvent.id || 0));
        dispatch(addNotification({ message: 'Evento eliminado correctamente', color: 'success' }));
        fetchEvents();
        setShowModal(false);
      } catch (error) {
        console.error('Error deleting event:', error);
        dispatch(addNotification({ message: 'Error al eliminar el evento', color: 'danger' }));
      }
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStartDate(null);
    setEndDate(null);
    setRepetition(Repetition.NONE);
    setShowModal(false);
    if (editorRef.current) {
      editorRef.current.remove();
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Evento' : 'Crear Evento'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group controlId="formEventTitle">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formEventRepetition">
                <Form.Label>Repetir Evento</Form.Label>
                <Form.Control
                  as="select"
                  value={repetition}
                  onChange={(e) => setRepetition(e.target.value as Repetition)}
                >
                  <option value={Repetition.NONE}>No repetir</option>
                  <option value={Repetition.DAILY}>Diariamente</option>
                  <option value={Repetition.WEEKLY}>Semanalmente</option>
                  <option value={Repetition.FIFTEEN_DAYS}>Cada 15 días</option>
                  <option value={Repetition.MONTHLY}>Mensualmente</option>
                  <option value={Repetition.YEARLY}>Anualmente</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formEventStartDate">
                <Form.Label>Fecha y Hora de Inicio</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm') : ''}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEventEndDate">
                <Form.Label>Fecha y Hora de Fin</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm') : ''}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="formEventDescription">
            <Form.Label>Descripción</Form.Label>
            <CustomEditor
              content={description}
              setContent={setDescription}
              templateType={TemplateType.EVENTS}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit" style={{ marginInline: 10 }}>
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
          {isEditing && selectedEvent && selectedEvent.id !== null && (
            <Button variant="danger" onClick={handleDelete} className="ml-2">
              Eliminar
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
