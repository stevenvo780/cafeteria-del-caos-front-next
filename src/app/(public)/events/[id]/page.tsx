import moment from 'moment';
import { Events } from '@/utils/types';
import EventDetailClient from './EventDetailClient';

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/events/${params.id}`);
    const event: Events = await response.json();
    
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const [eventResponse, upcomingResponse] = await Promise.all([
      fetch(`${baseUrl}/events/${params.id}`),
      fetch(`${baseUrl}/events/home/upcoming?limit=31`)
    ]);

    const eventData: Events = await eventResponse.json();
    const upcomingEvents: Events[] = await upcomingResponse.json();

    eventData.startDate = moment.utc(eventData.startDate).local().toDate();
    eventData.endDate = moment.utc(eventData.endDate).local().toDate();

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
