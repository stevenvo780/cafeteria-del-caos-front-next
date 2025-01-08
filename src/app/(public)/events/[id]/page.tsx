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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const event = await getEvent(resolvedParams.id);
    const startDate = moment.utc(event.startDate).local();
    const formattedDate = startDate.format('LL [a las] LT');
    const description = `${event.title} - ${formattedDate}. ${event.description.replace(/<[^>]*>/g, '').substring(0, 155)}...`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const imageUrl = event.imageUrl || `${siteUrl}/og-image.jpg`;

    return {
      title: `${event.title} - Cafetería del Caos`,
      description: description,
      openGraph: {
        title: `${event.title} - Cafetería del Caos`,
        description: description,
        url: `${siteUrl}/events/${resolvedParams.id}`,
        type: 'article',
        publishedTime: event.startDate,
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: 'Evento - Cafetería del Caos',
      description: 'Detalles del evento en Cafetería del Caos'
    };
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function EventLoader({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const [eventData, upcomingEvents] = await Promise.all([
      getEvent(resolvedParams.id),
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
      <EventLoader params={props.params} />
    </Suspense>
  );
}
