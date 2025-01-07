'use client';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import SocialShareButtons from '@/components/SocialShareButtons';
import { Library } from '@/utils/types';

interface ShareNoteModalProps {
  show: boolean;
  onHide: () => void;
  note: Library;
}

const ShareNoteModal: React.FC<ShareNoteModalProps> = ({ show, onHide, note }) => {
  const shareUrl = `${window.location.origin}/library/${note.id}`;
  const title = note.title;
  const summary = note.description;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-secondary">
        <Modal.Title style={{ color: 'var(--font-color)' }}>Compartir Nota</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'var(--card-color)', color: 'var(--font-color)' }}>
        <SocialShareButtons shareUrl={shareUrl} title={title} summary={summary} />
      </Modal.Body>
      <Modal.Footer className="border-secondary">
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareNoteModal;
