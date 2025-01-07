'use client';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Library, Like } from '@/utils/types';
import LibraryCard from './LibraryCard';

interface LibraryListProps {
  libraries: Library[];
  onNavigate: (library: Library) => void;
  likesData: Record<number, { likes: number; dislikes: number; userLike: Like | null }>;
  handleLikeToggle: (libraryId: number, isLike: boolean) => void;
  handleShare: (library: Library) => void;
}

const calculateColSize = (totalLibraries: number) => {
  if (totalLibraries === 1) return 12;
  if (totalLibraries === 2) return 6;
  if (totalLibraries === 3) return 4;
  return 3;
};

const LibraryList: React.FC<LibraryListProps> = ({
  libraries,
  onNavigate,
  likesData,
  handleLikeToggle,
  handleShare,
}) => {
  const colSize = calculateColSize(libraries.length);

  return (
    <Row>
      {libraries.map((library: Library) => (
        <Col key={library.id} md={colSize}>
          <LibraryCard
            library={library}
            onClick={() => onNavigate(library)}
            likesData={likesData[library.id] || { likes: 0, dislikes: 0, userLike: null }}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
          />
        </Col>
      ))}
    </Row>
  );
};

export default LibraryList;
