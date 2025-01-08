export const dynamic = 'force-dynamic';
export const revalidate = 0;

import moment from 'moment';
import { notFound } from 'next/navigation';
import EventDetailClient from './EventDetailClient';
import { headers } from 'next/headers';
import { Suspense } from 'react';

async function getHeadersObject() {
  const headersList = await headers();
  const headersObject: { [key: string]: string } = {};
  for (const [key, value] of headersList.entries()) {
    headersObject[key] = value;
  }
  return headersObject;
}

async function getEvent(eventId: string) {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${baseUrl}/events/${eventId}`, {
    cache: 'no-store',
    headers: await getHeadersObject()
  });

  if (!response.ok) {
    if (response.status === 404) notFound();
    throw new Error('Failed to fetch event');
  }
  return response.json();
}

async function getUpcomingEvents() {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${baseUrl}/events/home/upcoming?limit=31`, {
    cache: 'no-store',
    headers: await getHeadersObject()
  });

  if (!response.ok) throw new Error('Failed to fetch upcoming events');
  return response.json();
}

export function generateMetadata() {
  return {
    title: 'Cafetería del Caos',
    description: 'Detalles del evento'
  };
}

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

type EventLoaderProps = {
  params: Promise<{ id: string }>;
};

async function EventLoader({ params }: EventLoaderProps) {
  const { id: eventId } = await params;

  try {
    const [eventData, upcomingEvents] = await Promise.all([
      getEvent(eventId),
      getUpcomingEvents()
    ]);

    if (!eventData) {
      notFound();
    }

    eventData.startDate = moment.utc(eventData.startDate).local().toISOString();
    eventData.endDate = moment.utc(eventData.endDate).local().toISOString();

    return (
      <EventDetailClient
        event={eventData}
        upcomingEvents={upcomingEvents}
      />
    );
  } catch (error) {
    console.error('Error en EventLoader:', error);
    notFound();
  }
}

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EventLoader params={Promise.resolve(props.params)} />
    </Suspense>
  );
}
