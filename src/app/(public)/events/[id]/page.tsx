import moment from 'moment';
import api from '@/utils/axios';
import { Events } from '@/utils/types';
import EventDetailClient from './EventDetailClient';

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const response = await api.get(`/events/${params.id}`);
    const event: Events = response.data;
    const plainDescription = event.description.replace(/<[^>]+>/g, '').substring(0, 160);
    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/events/${params.id}`;

    return {
      title: `${event.title} - Cafetería del Caos`,
      description: plainDescription,
      openGraph: {
        title: event.title,
        description: plainDescription,
        url: shareUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: plainDescription,
      },
      other: {
        'application/ld+json': JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: plainDescription,
          startDate: event.startDate,
          endDate: event.endDate,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          url: shareUrl
        })
      }
    };
  } catch (error) {
    console.error('Error fetching event metadata:', error);
    return {
      title: 'Evento - Cafetería del Caos',
      description: 'Detalles del evento'
    };
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const response = await api.get(`/events/${params.id}`);
    const eventData: Events = response.data;
    eventData.startDate = moment.utc(eventData.startDate).local().toDate();
    eventData.endDate = moment.utc(eventData.endDate).local().toDate();

    const upcomingResponse = await api.get(`/events/home/upcoming?limit=31`);
    const upcomingEvents: Events[] = upcomingResponse.data;

    return (
      <EventDetailClient
        event={eventData}
        upcomingEvents={upcomingEvents}
      />
    );
  } catch (error) {
    console.error('Error fetching event details:', error);
    return <p>Error al cargar el evento</p>;
  }
}
