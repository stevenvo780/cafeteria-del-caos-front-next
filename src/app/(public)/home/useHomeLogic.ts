'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Publication, Like, CreatePublicationDto } from '@/utils/types';
import api from '@/utils/axios';
import { getPublications, addPublication, updatePublication, deletePublication } from '@/redux/publications';
import { addNotification } from '@/redux/ui';

export default function useHomeLogic(initialPublications: Publication[]) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const publications = useSelector((state: RootState) => state.publications.publications);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [likesData, setLikesData] = useState<Record<number, { likes: number; dislikes: number; userLike: Like | null }>>({});
  const [offset, setOffset] = useState<number>(4); // Empezamos en 4 porque ya tenemos los primeros 4 del SSR
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 4;

  const publicationRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    dispatch(getPublications(initialPublications));
    fetchLikesDataAsync(initialPublications);

    const publicationId = window.location.hash.replace('#', '');
    if (publicationId) {
      fetchPublicationById(publicationId);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleHashChange = () => {
    const publicationId = window.location.hash.replace('#', '');
    if (publicationId) {
      scrollToPublication(parseInt(publicationId));
    }
  };

  const fetchPublicationById = async (id: string) => {
    try {
      const response = await api.get<Publication>(`/publications/${id}`);
      const existingPublication = publications.find(p => p.id === parseInt(id));
      if (!existingPublication) {
        dispatch(addPublication(response.data));
      }
      setSelectedPublication(response.data);
      scrollToPublication(response.data.id);
    } catch (error) {
      console.error("Error al obtener la publicación:", error);
      dispatch(addNotification({ message: 'Error al obtener la publicación', color: 'danger' }));
    }
  };

  const fetchLikesDataAsync = async (publications: Publication[]) => {
    publications.forEach(async (publication) => {
      try {
        const [countResponse, userLikeResponse] = await Promise.all([
          api.get(`/likes/publication/${publication.id}/count`),
          api.get(`/likes/publication/${publication.id}/user-like`),
        ]);
        setLikesData(prevLikesData => ({
          ...prevLikesData,
          [publication.id]: {
            likes: countResponse.data.likes,
            dislikes: countResponse.data.dislikes,
            userLike: userLikeResponse.data || null,
          },
        }));
      } catch (error) {
        console.error("Error al obtener los likes:", error);
      }
    });
  };

  const scrollToPublication = (publicationId: number) => {
    const publicationElement = publicationRefs.current[publicationId];
    if (publicationElement) {
      setTimeout(() => {
        publicationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const fetchPublications = async () => {
    if (!hasMore) return;
    
    try {
      const response = await api.get<Publication[]>('/publications', {
        params: { limit, offset },
      });

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        dispatch(getPublications([...publications, ...response.data]));
        fetchLikesDataAsync(response.data);
        setOffset(offset + limit);
      }
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
      dispatch(addNotification({ message: 'Error al obtener las publicaciones', color: 'danger' }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const publicationData: CreatePublicationDto = {
      title,
      content,
    };

    try {
      if (editingPublication) {
        await api.patch(`/publications/${editingPublication.id}`, publicationData);
        dispatch(updatePublication({ ...editingPublication, ...publicationData }));
        dispatch(addNotification({ message: 'Publicación actualizada correctamente', color: 'success' }));
      } else {
        const response = await api.post<Publication>('/publications', publicationData);
        dispatch(addPublication(response.data));
        dispatch(addNotification({ message: 'Publicación creada correctamente', color: 'success' }));
      }
      setShowModal(false);
      setEditingPublication(null);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      dispatch(addNotification({ message: 'Error al guardar la publicación', color: 'danger' }));
    }
  };

  const handleEdit = (publication: Publication | null) => {
    if (!publication) {
      setTitle('');
      setContent('');
      setShowModal(true);
      setEditingPublication(null);
      return;
    }
    setEditingPublication(publication);
    setTitle(publication.title);
    setContent(publication.content);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/publications/${id}`);
      dispatch(deletePublication(id));
      dispatch(addNotification({ message: 'Publicación eliminada correctamente', color: 'success' }));
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      dispatch(addNotification({ message: 'Error al eliminar la publicación', color: 'danger' }));
    }
  };

  const handleLikeToggle = async (publicationId: number, isLike: boolean) => {
    if (!user) {
      dispatch(addNotification({ message: 'Debes iniciar sesión para dar like o dislike', color: 'warning' }));
      return;
    }
    try {
      const currentLike = likesData[publicationId]?.userLike;

      if (currentLike && currentLike.isLike === isLike) {
        await api.delete(`/likes/${currentLike.id}`);
      } else {
        await api.post('/likes', {
          targetType: 'PUBLICATION',
          targetId: publicationId,
          isLike
        });
      }

      fetchLikesDataAsync([{ id: publicationId } as Publication]);
    } catch (error) {
      console.error("Error al dar like/dislike:", error);
      dispatch(addNotification({ message: 'Error al dar like/dislike', color: 'danger' }));
    }
  };

  const handleShare = (publication: Publication) => {
    setSelectedPublication(publication);
    setShareModalVisible(true);
  };

  return {
    publications,
    showModal,
    shareModalVisible,
    editingPublication,
    selectedPublication,
    likesData,
    hasMore,
    user,
    title,
    content,
    publicationRefs,
    handleEdit,
    handleDelete,
    handleLikeToggle,
    handleShare,
    handleSubmit,
    fetchPublications,
    setShowModal,
    setShareModalVisible,
    setTitle,
    setContent,
  };
}
