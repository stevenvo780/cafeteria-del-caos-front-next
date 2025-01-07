'use client';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import SocialShareButtons from '@/components/SocialShareButtons';
import { Publication } from '@/utils/types';

interface ShareModalProps {
  show: boolean;
  onHide: () => void;
  publication: Publication;
}

const ShareModal: React.FC<ShareModalProps> = ({ show, onHide, publication }) => {
  const shareUrl = `${window.location.origin}/#${publication.id}`;
  const title = publication.title;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Compartir publicación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SocialShareButtons shareUrl={shareUrl} title={title} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
