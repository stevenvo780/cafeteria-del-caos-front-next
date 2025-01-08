'use client';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Library, Like } from '@/utils/types';
import LibraryList from './LibraryList';
import LibraryFormModal from './LibraryFormModal';
import ShareNoteModal from './ShareNoteModal';
import ActionButtons from '@/components/ActionButtons';
import Pagination from 'react-bootstrap/Pagination';
import LibraryHeader from './LibraryHeader';
import { getRoleInSpanish } from '@/utils/roleTranslation';
import { useLibraryLogic } from './useLibraryLogic';
import { UserRole } from '@/utils/types';

interface ClientLibraryProps {
  initialData: {
    initialNote: Library | null;
    libraries: Library[];
    totalItems: number;
    likesData: Record<number, {
      likes: number;
      dislikes: number;
      userLike: Like | null;
    }>;
  };
}

const ClientLibrary: React.FC<ClientLibraryProps> = ({ initialData }) => {
  const {
    libraries,
    currentNote,
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
    setEditingLibrary,
    fetchAvailableParents,
  } = useLibraryLogic(initialData);

  const permissionsEditable = (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN || userRole === UserRole.EDITOR);

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
          handleSearch={handleSearch}  // Ya está tipado correctamente en useLibraryLogic
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
          availableParents={availableParents}
          currentNote={currentNote}
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

export default ClientLibrary;
