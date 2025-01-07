'use client';
import React from 'react';
import { FaThumbsUp, FaThumbsDown, FaShareAlt } from 'react-icons/fa';
import { Like } from '../utils/types';

interface ActionButtonsProps {
  userLike: Like | null;
  likesCount: number;
  dislikesCount: number;
  onLikeToggle: (isLike: boolean) => void;
  onShare: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  userLike,
  likesCount,
  dislikesCount,
  onLikeToggle,
  onShare,
}) => {
  return (
    <div className="d-flex align-items-center mt-3">
      <span
        style={{ cursor: 'pointer', marginInline: '10px' }}
        onClick={(e) => { e.stopPropagation(); onLikeToggle(true); }}
      >
        <FaThumbsUp
          style={{ 
            cursor: 'pointer', 
            marginInline: '3px', 
            color: userLike?.isLike === true ? 'var(--warning-hover)' : 'var(--secondary-color)' 
          }}
          size={27}
        />
        {likesCount}
      </span>
      <span
        style={{ cursor: 'pointer', marginInline: '10px' }}
        onClick={(e) => { e.stopPropagation(); onLikeToggle(false); }}
      >
        <FaThumbsDown
          style={{ 
            cursor: 'pointer', 
            marginInline: '3px', 
            color: userLike?.isLike === false ? 'var(--warning-hover)' : 'var(--secondary-color)' 
          }}
          size={27}
        />
        {dislikesCount}
      </span>
      <span
        style={{ cursor: 'pointer', marginInline: '10px' }}
        onClick={(e) => { e.stopPropagation(); onShare(); }}
      >
        <FaShareAlt
          style={{ cursor: 'pointer', marginInline: '10px', color: 'var(--secondary-color)' }}
          size={27}
        />
      </span>
    </div>
  );
};

export default ActionButtons;
