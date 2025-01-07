'use client';
import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { Publication, Like, UserRole, User } from '@/utils/types';
import { getRoleInSpanish } from '@/utils/roleTranslation';
import InfiniteScroll from 'react-infinite-scroll-component';
import ActionButtons from '@/components/ActionButtons';

interface PublicationsListProps {
  publications: Publication[];
  handleEdit: (publication: Publication | null) => void;
  handleDelete: (id: number) => void;
  handleLikeToggle: (publicationId: number, isLike: boolean) => void;
  handleShare: (publication: Publication) => void;
  hasMore: boolean;
  fetchPublications: () => void;
  likesData: Record<number, { likes: number; dislikes: number; userLike: Like | null }>;
  user: User | null;
  setShowModal: (show: boolean) => void;
  publicationRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

const PublicationsList: React.FC<PublicationsListProps> = ({
  publications,
  handleEdit,
  handleDelete,
  handleLikeToggle,
  handleShare,
  likesData,
  user,
  setShowModal,
  publicationRefs,
  hasMore,
  fetchPublications,
}) => {
  return (
    <>
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
        <div className="d-flex justify-content-end mb-4">
          <Form.Control
            type="text"
            placeholder="Publicar algo..."
            className="form-control"
            onClick={() => {
              handleEdit(null);
              setShowModal(true);
            }}
            readOnly
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      <InfiniteScroll
        dataLength={publications.length}
        next={fetchPublications}
        hasMore={hasMore}
        loader={<></>}
        scrollableTarget="scrollableDiv"
      >
        <div className='scrollable-container' id="scrollableDiv">
          {publications.map((publication: Publication) => {
            const likeData = likesData[publication.id] || { likes: 0, dislikes: 0, userLike: null };
            return (
              <Card
                className="mb-4"
                key={publication.id}
                style={{ overflow: 'hidden' }}
                ref={(el: HTMLDivElement | null) => { publicationRefs.current[publication.id] = el; }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <Card.Title style={{ color: 'var(--card-title-color)' }}>{publication.title}</Card.Title>
                    {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
                      <div>
                        <FaEdit
                          onClick={() => handleEdit(publication)}
                          style={{ cursor: 'pointer', marginRight: '10px' }}
                          size={20}
                        />
                        <FaTrash
                          onClick={() => handleDelete(publication.id)}
                          style={{ cursor: 'pointer' }}
                          size={20}
                        />
                      </div>
                    )}
                  </div>
                  {publication.author && (
                    <div className="text-muted mb-2 d-flex align-items-center publication-author">
                      <FaUser style={{ marginRight: '8px' }} />
                      {`${publication.author.name} - ${getRoleInSpanish(publication.author.role)}`}
                    </div>
                  )}
                  <div
                    style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      color: 'var(--font-color)'
                    }}
                    dangerouslySetInnerHTML={{ __html: publication.content }}
                  />
                  <div className="text-muted mt-2 publication-date">
                    {publication.createdAt ? new Date(publication.createdAt).toLocaleDateString() : ''}
                  </div>
                  <ActionButtons
                    userLike={likeData.userLike}
                    likesCount={likeData.likes}
                    dislikesCount={likeData.dislikes}
                    onLikeToggle={(isLike: boolean) => handleLikeToggle(publication.id, isLike)}
                    onShare={() => handleShare(publication)}
                  />
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </InfiniteScroll >
    </>
  );
};

export default PublicationsList;
