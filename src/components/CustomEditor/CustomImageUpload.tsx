'use client';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { storage } from '../../utils/firebase';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import { FaImage } from 'react-icons/fa'; // Importar el icono de imagen

interface CustomImageUploadProps {
  editorState: EditorState;
  onEditorStateChange: (editorState: EditorState) => void;
}

const CustomImageUpload: React.FC<CustomImageUploadProps> = ({ editorState, onEditorStateChange }) => {
  const [show, setShow] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setUploading(true);

    try {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`images/${imageFile.name}`);
      await fileRef.put(imageFile);
      const fileUrl = await fileRef.getDownloadURL();

      // Insert the image into the editor
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: fileUrl });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

      onEditorStateChange(EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()));
      handleClose();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ margin: 5 }}>
      <FaImage onClick={handleShow} style={{ cursor: 'pointer', fontSize: '18px', marginRight: '8px' }} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Subir Imagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Seleccionar imagen</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={!imageFile || uploading}>
            {uploading ? 'Subiendo...' : 'Subir y Insertar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomImageUpload;
