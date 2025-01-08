'use client';
import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Events, UserRole } from '@/utils/types';
import { FaEdit } from 'react-icons/fa';
import { getNextOccurrence } from '@/app/(public)/events/EventUtils';
import SocialShareButtons from '@/components/SocialShareButtons';
import ScrollableEvents from '@/components/ScrollableEvents';
import EventModal from '@/components/EventModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles.css';
import moment from 'moment-timezone';

export default function EventDetailClient({
  event,
  upcomingEvents
}: {
  event: Events;
  upcomingEvents: Events[];
}) {
  const userRole = useSelector((state: RootState) => state.auth.userData);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const nextOccurrence = getNextOccurrence(event);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'No disponible';
    return moment(date).format('LLL');
  };

  useEffect(() => {
    if (nextOccurrence) {
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const startTime = nextOccurrence.getTime();
        const timeDiff = startTime - now;

        if (timeDiff <= 0) {
          clearInterval(intervalId);
          setTimeRemaining('¡El evento ha comenzado!');
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          if (days > 0) {
            setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
          } else {
            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
          }
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [nextOccurrence]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  if (!event) {
    return <p>Cargando detalles del evento...</p>;
  }

  return (
    <Container className="mt-4 d-flex flex-column">
      {(userRole?.role === UserRole.ADMIN || userRole?.role === UserRole.SUPER_ADMIN) && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px', zIndex: 100 }}>
          <FaEdit size={24} onClick={handleEdit} style={{ cursor: 'pointer' }} />
        </div>
      )}
      <Row style={{ marginBottom: '20px' }}>
        <Col md={8} className="order-first order-md-last mb-4">
          <Card>
            {event.imageUrl && (
              <Card.Img
                variant="top"
                src={event.imageUrl}
                alt={event.title}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderBottom: '1px solid #dee2e6'
                }}
              />
            )}
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Text dangerouslySetInnerHTML={{ __html: event.description }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="order-last order-md-first">
          <Card className="mb-4 gradient-card">
            <Card.Body>
              <Card.Text className="countdown-text">{timeRemaining || '00:00:00'}</Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Fecha y Hora</Card.Title>
              <Card.Text>
                {formatDateTime(nextOccurrence)}
                <br />
                <small className="text-muted">(Tu zona horaria: {moment.tz.guess()})</small>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <ReactCalendar
                value={nextOccurrence || new Date(event.startDate)}
                tileDisabled={() => false}
                className="minimal-calendar"
                showNavigation={false}
              />
            </Card.Body>
          </Card>
          <SocialShareButtons size={50} shareUrl={shareUrl} title={event.title} />
        </Col>
      </Row>
      {upcomingEvents.length > 0 && <ScrollableEvents events={upcomingEvents} />}
      {showModal && (
        <EventModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedEvent={event}
          fetchEvents={() => {}}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
}