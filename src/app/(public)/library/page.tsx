/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import serverApi from '@/utils/serverApi';
import ClientLibrary from './ClientLibrary';
import { Library } from '@/utils/types';

interface Props {
  params: { noteId?: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseMetadata = {
    title: 'Biblioteca | Cafetería del Caos',
    description: 'Explora nuestra biblioteca de conocimiento. Encuentra artículos, guías y recursos sobre diversos temas.',
    keywords: 'biblioteca, conocimiento, recursos, artículos, guías',
    openGraph: {
      title: 'Biblioteca | Cafetería del Caos',
      description: 'Explora nuestra biblioteca de conocimiento',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/library`,
      images: [{
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Cafetería del Caos',
      }]
    }
  };

  if (params.noteId) {
    try {
      const note = await serverApi.get<Library>(`/library/${params.noteId}`);
      return {
        ...baseMetadata,
        title: `${note.data.title} | Biblioteca`,
        description: note.data.description.substring(0, 160),
        openGraph: {
          ...baseMetadata.openGraph,
          title: `${note.data.title} | Biblioteca`,
          description: note.data.description.substring(0, 160),
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/library/${params.noteId}`,
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
      const likesData = likesResults.reduce((acc: Record<number, any>, curr) => {
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

export default async function Page({ params }: Props) {
  const initialData = await getInitialData(params.noteId);
  return <ClientLibrary initialData={initialData} />;
}
