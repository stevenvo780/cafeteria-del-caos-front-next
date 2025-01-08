'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import api from '@/utils/axios';
import { RootState } from '@/redux/store';
import { getLibraries, addLibrary, updateLibrary, deleteLibrary } from '@/redux/library';
import { addNotification } from '@/redux/ui';
import {
  Library,
  CreateLibraryDto,
  UpdateLibraryDto,
  Like,
  LikeTarget,
  LibraryReference
} from '@/utils/types';

interface InitialData {
  initialNote: Library | null;
  libraries: Library[];
  totalItems: number;
  likesData: Record<number, { likes: number; dislikes: number; userLike: Like | null }>;
}

export function useLibraryLogic(initialData: InitialData) {
  const router = useRouter();
  const dispatch = useDispatch();
  const editingLibraryRef = useRef<Library | null>(null);

  // Estados principales
  const [currentNote, setCurrentNote] = useState<Library | null>(initialData.initialNote);
  const [navigationStack, setNavigationStack] = useState<Library[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLibrary, setEditingLibraryState] = useState<Library | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likesData, setLikesData] = useState(initialData.likesData);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(initialData.totalItems);
  const [availableParents, setAvailableParents] = useState<LibraryReference[]>([]);

  // Información del estado global (Redux)
  const libraries = useSelector((state: RootState) => state.library.libraries);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const itemsPerPage = 50;

  useEffect(() => {
    // Cargamos en Redux lo que venga en initialData
    dispatch(getLibraries(initialData.libraries));
  }, [dispatch, initialData.libraries]);

  const fetchLibraries = async (page = 1, limit = itemsPerPage) => {
    try {
      const response = await api.get(`/library`, { params: { page, limit } });
      dispatch(getLibraries(response.data.data));
      setTotalItems(response.data.total);
      setCurrentPage(response.data.currentPage);
      setCurrentNote(null);
      fetchLikesDataAsync(response.data.data);
    } catch (error) {
      console.error('Error fetching libraries:', error);
      dispatch(addNotification({ message: 'Error al obtener las referencias', color: 'danger' }));
    }
  };

  const fetchNoteById = async (id: number) => {
    try {
      const response = await api.get<Library>(`/library/${id}`);
      setCurrentNote(response.data);
      fetchLikesDataAsync([response.data]);
      return response.data;
    } catch (error) {
      console.error('Error fetching note:', error);
      dispatch(addNotification({ message: 'Error al obtener la nota', color: 'danger' }));
      return null;
    }
  };

  const fetchLikesDataAsync = async (libs: Library[]) => {
    for (const lib of libs) {
      if (!lib || !lib.id) continue;
      try {
        const [countResponse, userLikeResponse] = await Promise.all([
          api.get(`/likes/library/${lib.id}/count`),
          api.get(`/likes/library/${lib.id}/user-like`)
        ]);
        setLikesData((prev) => ({
          ...prev,
          [lib.id]: {
            likes: countResponse.data.likes,
            dislikes: countResponse.data.dislikes,
            userLike: userLikeResponse.data || null
          }
        }));
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    }
  };

  const handleLikeToggle = async (noteId: number, isLike: boolean) => {
    if (!userRole) {
      dispatch(addNotification({ message: 'Debes iniciar sesión para dar like o dislike', color: 'warning' }));
      return;
    }
    try {
      const currentLike = likesData[noteId]?.userLike;
      // Si ya tiene like/dislike igual, lo quitamos
      if (currentLike && currentLike.isLike === isLike) {
        await api.delete(`/likes/${currentLike.id}`);
      } else {
        await api.post('/likes', { targetType: LikeTarget.LIBRARY, targetId: noteId, isLike });
      }
      fetchLikesDataAsync([{ id: noteId } as Library]);
    } catch (error) {
      console.error('Error al dar like o dislike:', error);
      dispatch(addNotification({ message: 'Error al dar like o dislike', color: 'danger' }));
    }
  };

  const handleShare = (library: Library) => {
    setSelectedLibrary(library);
    setShareModalVisible(true);
  };

  const handleNoteClick = async (note: Library) => {
    // Guardamos la nota actual para poder regresar
    if (currentNote) {
      setNavigationStack((prev) => [...prev, currentNote]);
    }
    // Navegamos a la nueva
    router.push(`/library/${note.id}`);
    const fetched = await fetchNoteById(note.id);
    if (fetched) setCurrentNote(fetched);
  };

  const handleGoBack = async () => {
    const previousNote = navigationStack.pop();
    setNavigationStack([...navigationStack]); // remover la última

    if (!previousNote) {
      // Si no hay más stack, regresamos a /library y cargamos todo
      router.push('/library');
      await fetchLibraries();
      setCurrentNote(null);
    } else {
      router.push(`/library/${previousNote.id}`);
      const fetched = await fetchNoteById(previousNote.id);
      if (fetched) setCurrentNote(fetched);
    }
  };

  const handleCreateOrUpdate = async (libraryData: CreateLibraryDto | UpdateLibraryDto) => {
    try {
      if (editingLibrary) {
        // Actualiza
        const response = await api.patch(`/library/${editingLibrary.id}`, libraryData);
        dispatch(updateLibrary({ ...editingLibrary, ...response.data }));
        setCurrentNote(response.data);
        fetchLikesDataAsync([response.data]);
        dispatch(addNotification({ message: 'Nota actualizada correctamente', color: 'success' }));
      } else {
        // Crea
        const response = await api.post<Library>('/library', {
          ...libraryData,
          parentNoteId: currentNote?.id || undefined
        });
        dispatch(addLibrary(response.data));
        await handleNoteClick(response.data);
        dispatch(addNotification({ message: 'Nota creada correctamente', color: 'success' }));
      }

      // Si estamos en subnota, refrescamos
      if (currentNote) {
        await fetchNoteById(currentNote.id);
      } else {
        await fetchLibraries();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving note:', error);
      dispatch(addNotification({ message: 'Error al guardar la nota', color: 'danger' }));
    }
  };

  const handleEdit = (library: Library) => {
    setEditingLibrary(library);
    fetchAvailableParents();
    setShowModal(true);
  };

  const handleDelete = async (library: Library) => {
    if (library.children && library.children.length > 0) {
      dispatch(addNotification({ message: 'No puedes eliminar una nota que tiene subnotas', color: 'warning' }));
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
      try {
        await api.delete(`/library/${library.id}`);
        dispatch(deleteLibrary(library.id));
        dispatch(addNotification({ message: 'Nota eliminada correctamente', color: 'success' }));

        // Si borramos la que estamos viendo, tenemos que volver atrás
        if (currentNote && currentNote.id === library.id) {
          await handleGoBack();
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        dispatch(addNotification({ message: 'Error al eliminar la nota', color: 'danger' }));
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const response = await api.get('/library/search', { params: { query } });
      dispatch(getLibraries(response.data));
      setTotalItems(response.data.total);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching libraries:', error);
      dispatch(addNotification({ message: 'Error al buscar las referencias', color: 'danger' }));
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchLibraries(page);
  };

  const setEditingLibrary = (library: Library | null) => {
    editingLibraryRef.current = library;
    setEditingLibraryState(library);
  };

  const fetchAvailableParents = async () => {
    try {
      const response = await api.get<LibraryReference[]>('/library/view/references');
      const allReferences = response.data;
      setAvailableParents(
        allReferences.filter(
          (ref) => ref.id !== editingLibrary?.id && !isDescendant(ref.id, editingLibrary?.id)
        )
      );
    } catch (error) {
      console.error('Error fetching available parents:', error);
      dispatch(addNotification({ message: 'Error al obtener referencias disponibles', color: 'danger' }));
    }
  };

  const isDescendant = (parentId: number, childId: number | undefined): boolean => {
    if (!childId) return false;
    const parent = libraries.find((lib) => lib.id === parentId);
    if (!parent) return false;
    // si el hijo está directo
    if (parent.children?.some((c) => c.id === childId)) return true;
    // si está anidado
    return parent.children?.some((c) => isDescendant(c.id, childId)) || false;
  };

  return {
    libraries,
    currentNote,
    navigationStack,
    showModal,
    editingLibrary,
    searchQuery,
    likesData,
    shareModalVisible,
    selectedLibrary,
    currentPage,
    totalItems,
    availableParents,
    userRole,
    itemsPerPage,
    setShowModal,
    setSearchQuery,
    handleNoteClick,
    handleGoBack,
    handleCreateOrUpdate,
    handleEdit,
    handleDelete,
    handleSearch,
    handlePageChange,
    handleLikeToggle,
    handleShare,
    setShareModalVisible,
    setSelectedLibrary,
    setEditingLibrary,
    fetchAvailableParents
  };
}
