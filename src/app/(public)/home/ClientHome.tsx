'use client';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Publication, Events, Library } from '@/utils/types';
import PublicationsList from './PublicationsList';
import Sidebar from './Sidebar';
import PublicationModal from './PublicationModal';
import ShareModal from './ShareModal';
import ScrollableEvents from '@/components/ScrollableEvents';
import useHomeLogic from './useHomeLogic';

interface ClientHomeProps {
  initialData: {
    initialPublications: Publication[];
    repetitiveEvents: Events[];
    uniqueEvents: Events[];
    latestNotes: Library[];
    guildMemberCount: number | null;
  };
}

const ClientHome: React.FC<ClientHomeProps> = ({ initialData }) => {
  const {
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
  } = useHomeLogic(initialData.initialPublications);

  return (
    <Container className="p-0">
      <Row className="m-0">
        <Col md={12}>
          {initialData.repetitiveEvents.length > 0 && (
            <ScrollableEvents events={initialData.repetitiveEvents} />
          )}
        </Col>
      </Row>
      <Row className="m-0">
        <Col md={3}>
          <Sidebar 
            initialUniqueEvents={initialData.uniqueEvents}
            initialLatestNotes={initialData.latestNotes}
            initialGuildMemberCount={initialData.guildMemberCount}
          />
        </Col>
        <Col md={9} style={{ marginTop: 40 }}>
          <PublicationsList
            publications={publications}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
            likesData={likesData}
            user={user}
            setShowModal={setShowModal}
            publicationRefs={publicationRefs}
            hasMore={hasMore}
            fetchPublications={fetchPublications}
          />
        </Col>
      </Row>
      <PublicationModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        editingPublication={editingPublication}
      />
      {selectedPublication && (
        <ShareModal
          show={shareModalVisible}
          onHide={() => setShareModalVisible(false)}
          publication={selectedPublication}
        />
      )}
    </Container>
  );
};

export default ClientHome;
