'use client';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Library } from '@/utils/types';
import { useRouter } from 'next/navigation';

interface LatestNotesProps {
  notes: Library[];
}

const LatestNotes: React.FC<LatestNotesProps> = ({ notes }) => {
  const router = useRouter();

  const handleNoteClick = (noteId: number | null) => {
    if (noteId !== null) {
      router.push(`/library/${noteId}`);
    }
  };

  return (
    <div>
      <h4 className="mt-4">Últimas Notas</h4>
      {notes.length > 0 ? (
        notes?.map((note) => (
          <Card
            className="mb-3"
            key={note.id}
            onClick={() => handleNoteClick(note.id || 0)}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>{note.title}</Card.Title>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hay notas recientes</p>
      )}
    </div>
  );
};

export default LatestNotes;
