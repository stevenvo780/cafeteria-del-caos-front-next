'use client';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Events } from '@/utils/types';
import { useRouter } from 'next/navigation';
import './styles.css';

interface UpcomingEventsProps {
  events: Events[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const router = useRouter();

  const handleEventClick = (eventId: number | null) => {
    if (eventId !== null) {
      router.push(`/events/${eventId}`);
    }
  };

  return (
    <div>
      <h4>Eventos importantes</h4>
      {events.length > 0 ? (
        events?.map((event) => (
          <Card
            className="mb-3 gradient-card"
            key={event.id}
            onClick={() => handleEventClick(event.id || 0)}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title style={{ color: "white" }} >{event.title}</Card.Title>
              <Card.Text style={{ color: "white" }} >
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.startDate).toLocaleTimeString()}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hay eventos próximos</p>
      )}
    </div>
  );
};

export default UpcomingEvents;
