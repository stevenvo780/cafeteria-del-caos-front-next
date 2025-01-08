import { Metadata } from 'next';
import ClientHome from './(public)/home/ClientHome';
import serverApi from '@/utils/serverApi';

export const metadata: Metadata = {
  title: 'Cafetería del Caos | Espacio de Debates y Pensamiento Libre',
  description: 'Bienvenido al epicentro del caos intelectual. Un espacio para debates sin filtros, ideas radicales y discusiones que desafían la lógica convencional.',
  keywords: 'debates, pensamiento libre, filosofía, discusiones',
  openGraph: {
    title: 'Cafetería del Caos | Espacio de Debates',
    description: 'Un espacio para debates sin filtros y pensamiento libre',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Logo de Cafetería del Caos',
      }
    ],
  }
};

async function getInitialData() {
  try {
    const [publicationsRes, eventsRes, notesRes, guildMembersRes] = await Promise.all([
      serverApi.get('/publications', { params: { limit: 4, offset: 0 } }),
      serverApi.get('/events/home/upcoming?limit=31'),
      serverApi.get('/library/home/latest?limit=3'),
      serverApi.get('/discord/guild/members')
    ]);

    return {
      initialPublications: publicationsRes.data,
      repetitiveEvents: eventsRes.data.filter(event => event.repetition),
      uniqueEvents: eventsRes.data.filter(event => !event.repetition).slice(0, 3),
      latestNotes: notesRes.data,
      guildMemberCount: guildMembersRes.data
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      initialPublications: [],
      repetitiveEvents: [],
      uniqueEvents: [],
      latestNotes: [],
      guildMemberCount: null
    };
  }
}

export default async function HomePage() {
  const initialData = await getInitialData();
  return <ClientHome initialData={initialData} />;
}
