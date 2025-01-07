'use client';
import React from 'react';
import { Card } from 'react-bootstrap';
import ActionButtons from '@/components/ActionButtons';
import { Library, Like } from '@/utils/types';

interface LibraryCardProps {
  library: Library;
  onClick: () => void;
  likesData: { likes: number; dislikes: number; userLike: Like | null };
  handleLikeToggle: (libraryId: number, isLike: boolean) => void;
  handleShare: (library: Library) => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({
  library,
  onClick,
  likesData,
  handleLikeToggle,
  handleShare,
}) => {
  return (
    <Card 
      className="mb-4 library-card" 
      key={library.id} 
    >
      <Card.Body 
        onClick={onClick} 
        style={{ 
          cursor: 'pointer',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div className="d-flex justify-content-between">
          <Card.Title>{library.title}</Card.Title>
        </div>
        <div className="library-card-content">
          <div dangerouslySetInnerHTML={{ __html: library.description }} />
        </div>
      </Card.Body>
      <Card.Footer>
        <ActionButtons
          userLike={likesData.userLike}
          likesCount={likesData.likes}
          dislikesCount={likesData.dislikes}
          onLikeToggle={(isLike) => handleLikeToggle(library.id, isLike)}
          onShare={() => handleShare(library)}
        />
      </Card.Footer>
    </Card>
  );
};

export default LibraryCard;