/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import serverApi from '@/utils/serverApi';
import ClientLibrary from './ClientLibrary';
import { Library, Like } from '@/utils/types';

interface PageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const baseMetadata = {
    title: 'Biblioteca | Cafetería del Caos',
    description: 'Explora nuestra biblioteca de conocimiento. Encuentra artículos, guías y recursos sobre diversos temas.',
    keywords: 'biblioteca, conocimiento, recursos, artículos, guías',
    openGraph: {
      title: 'Biblioteca | Cafetería del Caos',
      description: 'Explora nuestra biblioteca de conocimiento',
      type: 'website',
      url: `${baseUrl}/library`,
      images: [{
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Cafetería del Caos',
      }]
    }
  };

  if (id) {
    try {
      const note = await serverApi.get<Library>(`/library/${id}`);
      return {
        ...baseMetadata,
        title: `${note.data.title} | Biblioteca`,
        description: note.data.description.substring(0, 160),
        openGraph: {
          ...baseMetadata.openGraph,
          title: `${note.data.title} | Biblioteca`,
          description: note.data.description.substring(0, 160),
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/library/${id}`,
        }
      };
    } catch (error) {
      console.error('Error fetching note metadata:', error);
    }
  }

  return baseMetadata;
}

async function getInitialData(noteId?: string) {
  try {
    if (noteId) {
      const [noteResponse, likesResponse, userLikeResponse] = await Promise.all([
        serverApi.get<Library>(`/library/${noteId}`),
        serverApi.get(`/likes/library/${noteId}/count`),
        serverApi.get(`/likes/library/${noteId}/user-like`)
      ]);

      return {
        initialNote: noteResponse.data,
        libraries: [],
        totalItems: 0,
        likesData: {
          [noteId]: {
            likes: likesResponse.data.likes,
            dislikes: likesResponse.data.dislikes,
            userLike: userLikeResponse.data || null
          }
        }
      };
    } else {
      const librariesResponse = await serverApi.get('/library', {
        params: { page: 1, limit: 50 }
      });

      const likesPromises = librariesResponse.data.data.map(async (library: Library) => {
        const [likesCount, userLike] = await Promise.all([
          serverApi.get(`/likes/library/${library.id}/count`),
          serverApi.get(`/likes/library/${library.id}/user-like`)
        ]);
        return {
          id: library.id,
          likes: likesCount.data.likes,
          dislikes: likesCount.data.dislikes,
          userLike: userLike.data || null
        };
      });

      const likesResults = await Promise.all(likesPromises);
      const likesData = likesResults.reduce((acc: Record<number, { likes: number; dislikes: number; userLike: Like | null }>, curr) => {
        acc[curr.id] = {
          likes: curr.likes,
          dislikes: curr.dislikes,
          userLike: curr.userLike
        };
        return acc;
      }, {});

      return {
        initialNote: null,
        libraries: librariesResponse.data.data,
        totalItems: librariesResponse.data.total,
        likesData
      };
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      initialNote: null,
      libraries: [],
      totalItems: 0,
      likesData: {}
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // Await the asynchronous params
  const initialData = await getInitialData(id);
  return <ClientLibrary initialData={initialData} />;
}
