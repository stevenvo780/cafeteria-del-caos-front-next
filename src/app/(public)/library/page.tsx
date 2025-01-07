'use client';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { RootState } from '@/redux/store';
import api from '@/utils/axios';
import { getLibraries, addLibrary, updateLibrary, deleteLibrary } from '@/redux/library';
import { addNotification } from '@/redux/ui';
import { Library, CreateLibraryDto, UpdateLibraryDto, Like, LikeTarget } from '@/utils/types';
import LibraryList from './LibraryList';
import LibraryFormModal from './LibraryFormModal';
import ShareNoteModal from './ShareNoteModal';
import ActionButtons from '@/components/ActionButtons';
import Pagination from 'react-bootstrap/Pagination';
import LibraryHeader from './LibraryHeader';
import { UserRole } from '@/utils/types';
import { getRoleInSpanish } from '@/utils/roleTranslation';

interface LibraryReference {
  id: number;
  title: string;
}

interface LibraryPageProps {
  initialNoteId?: string;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ initialNoteId }) => {
  const router = useRouter();
  const params = useParams();
  const noteId = initialNoteId || params?.noteId as string;
  const dispatch = useDispatch();
  const libraries = useSelector((state: RootState) => state.library.libraries);
  const [currentNote, setCurrentNote] = useState<Library | null>(null);
  const [navigationStack, setNavigationStack] = useState<Library[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingLibrary, setEditingLibrary] = useState<Library | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likesData, setLikesData] = useState<Record<number, { likes: number; dislikes: number; userLike: Like | null }>>({});
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 50;
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const permissionsEditable = (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN || userRole === UserRole.EDITOR);
  const [availableParents, setAvailableParents] = useState<LibraryReference[]>([]);

  useEffect(() => {
    if (noteId) {
      fetchNoteById(parseInt(noteId));
    } else {
      fetchLibraries();
      fetchAvailableParents();
    }
  }, [noteId]);

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

  const fetchLikesDataAsync = (libraries: Library[]) => {
    libraries.forEach(async (library) => {
      if (!library || !library.id) return;
      try {
        const [countResponse, userLikeResponse] = await Promise.all([
          api.get(`/likes/library/${library.id}/count`),
          api.get(`/likes/library/${library.id}/user-like`),
        ]);
        setLikesData(prevLikesData => ({
          ...prevLikesData,
          [library.id]: {
            likes: countResponse.data.likes,
            dislikes: countResponse.data.dislikes,
            userLike: userLikeResponse.data || null,
          },
        }));
      } catch (error) {
        console.error('Error fetching likes:', error);
        dispatch(addNotification({ message: `Error al obtener los likes de la nota ${library.id}`, color: 'danger' }));
      }
    });
  };

  const handleLikeToggle = async (noteId: number, isLike: boolean) => {
    if (!userRole) {
      dispatch(addNotification({ message: 'Debes iniciar sesión para dar like o dislike', color: 'warning' }));
      return;
    }
    try {
      const currentLike = likesData[noteId]?.userLike;
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
    if (currentNote) {
      setNavigationStack([...navigationStack, currentNote]);
    }
    router.push(`/library/${note.id}`);
    const fetchedNote = await fetchNoteById(note.id);
    if (fetchedNote) {
      setCurrentNote(fetchedNote);
    }
  };

  const handleGoBack = async () => {
    const previousNote = navigationStack.pop();
    setNavigationStack([...navigationStack]);

    if (!previousNote) {
      router.push('/library');
      await fetchLibraries();
      setCurrentNote(null);
    } else {
      router.push(`/library/${previousNote.id}`);
      const fetchedNote = await fetchNoteById(previousNote.id);
      setCurrentNote(fetchedNote);
    }
  };

  const handleCreateOrUpdate = async (libraryData: CreateLibraryDto | UpdateLibraryDto) => {
    try {
      if (editingLibrary) {
        const response = await api.patch(`/library/${editingLibrary.id}`, libraryData as UpdateLibraryDto);
        dispatch(updateLibrary({ ...editingLibrary, ...response.data } as Library));
        setCurrentNote(response.data);
        fetchLikesDataAsync([response.data]);
        dispatch(addNotification({ message: 'Nota actualizada correctamente', color: 'success' }));
      } else {
        const response = await api.post<Library>('/library', {
          ...libraryData,
          parentNoteId: currentNote?.id || undefined,
        } as CreateLibraryDto);
        dispatch(addLibrary(response.data));
        handleNoteClick(response.data);
        dispatch(addNotification({ message: 'Nota creada correctamente', color: 'success' }));

        if (currentNote) {
            fetchNoteById(currentNote.id);
        } else {
            fetchLibraries();
        }
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
        handleGoBack();
      } catch (error) {
        console.error('Error deleting note:', error);
        dispatch(addNotification({ message: 'Error al eliminar la Nota', color: 'danger' }));
      }
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery && searchQuery.length > 3) {
        const response = await api.get<Library[]>('/library/view/search', {
          params: { query: searchQuery },
        });
        dispatch(getLibraries(response.data));
        setCurrentNote(null);
      } else {
        fetchLibraries();
      }
    } catch (error) {
      console.error('Error searching notes:', error);
      dispatch(addNotification({ message: 'Error al realizar la búsqueda', color: 'danger' }));
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchLibraries(pageNumber, itemsPerPage);
  };

  const fetchAvailableParents = async () => {
    try {
      const response = await api.get<LibraryReference[]>('/library/view/references');
      const allReferences = response.data;
      
      setAvailableParents(allReferences.filter(ref => 
        ref.id !== editingLibrary?.id &&
        !isDescendant(ref.id, editingLibrary?.id)
      ));
    } catch (error) {
      console.error('Error fetching available parents:', error);
      dispatch(addNotification({ message: 'Error al obtener referencias disponibles', color: 'danger' }));
    }
  };

  const isDescendant = (parentId: number, currentId: number | undefined): boolean => {
    if (!currentId) return false;
    const parent = libraries.find(lib => lib.id === parentId);
    if (!parent?.children) return false;
    return parent.children.some(child => 
      child.id === currentId || isDescendant(child.id, currentId)
    );
  };

  return (
    <>
      <Container>
        <LibraryHeader
          currentNote={currentNote}
          onGoBack={handleGoBack}
          onEdit={() => currentNote && handleEdit(currentNote)}
          onDelete={() => currentNote && handleDelete(currentNote)}
          onCreate={() => {
            setEditingLibrary(null);
            fetchAvailableParents();
            setShowModal(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          permissionsEditable={permissionsEditable}
        />
        {currentNote && <br />}
        <Row className={currentNote ? 'library-detail-container' : ''}>
          {currentNote && (
            <>
              <Col xs={12} md={12}>
                <h4 className="m-0">{currentNote.title}</h4>
                {currentNote.author && (
                  <p className="text-muted m-0">{`${currentNote.author.name} - ${getRoleInSpanish(currentNote.author.role)}`}</p>
                )}
                <div dangerouslySetInnerHTML={{ __html: currentNote.description }} />
              </Col>
              <Col xs={12} md={12} className="text-left d-flex">
                <ActionButtons
                  userLike={likesData[currentNote.id]?.userLike}
                  likesCount={likesData[currentNote.id]?.likes || 0}
                  dislikesCount={likesData[currentNote.id]?.dislikes || 0}
                  onLikeToggle={(isLike) => handleLikeToggle(currentNote.id, isLike)}
                  onShare={() => handleShare(currentNote)}
                />
              </Col>
            </>
          )}
        </Row>
        {currentNote && <br />}
        {!currentNote ? (
          <LibraryList
            libraries={libraries}
            onNavigate={handleNoteClick}
            likesData={likesData}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
          />
        ) : currentNote.children && currentNote.children.length > 0 ? (
          <LibraryList
            libraries={currentNote.children}
            onNavigate={handleNoteClick}
            likesData={likesData}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
          />
        ) : (
          <p className="text-center text-muted">No hay subnotas.</p>
        )}
        <Pagination>
          {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => handlePageChange(idx + 1)}
              style={{ cursor: 'pointer', margin: '0 5px' }}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Container>
      {permissionsEditable && (
        <LibraryFormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSubmit={handleCreateOrUpdate}
          editingLibrary={editingLibrary}
          showModal={showModal}
          availableParents={availableParents}
          currentNote={currentNote} // Pasar currentNote al modal
        />
      )}
      {selectedLibrary && (
        <ShareNoteModal
          show={shareModalVisible}
          onHide={() => setShareModalVisible(false)}
          note={selectedLibrary}
        />
      )}
    </>
  );
};

export default LibraryPage;
