'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { TemplateType } from '@/utils/types';
import { Library, CreateLibraryDto, UpdateLibraryDto, LibraryVisibility } from '@/utils/types';
import CustomEditor from '@/components/CustomEditor';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserRole } from '@/utils/types';

interface LibraryReference {
  id: number;
  title: string;
}

interface LibraryFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (libraryData: CreateLibraryDto | UpdateLibraryDto) => void;
  editingLibrary: Library | null;
  availableParents: LibraryReference[];
  currentNote?: Library | null;
}

const LibraryFormModal: React.FC<LibraryFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  editingLibrary,
  availableParents = [],
  currentNote,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [parentNoteId, setParentNoteId] = useState<number | undefined>(undefined);
  const [visibility, setVisibility] = useState<LibraryVisibility>(LibraryVisibility.GENERAL);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);

  useEffect(() => {
    if (editingLibrary) {
      setTitle(editingLibrary.title);
      setDescription(editingLibrary.description);
      setParentNoteId(editingLibrary.parent?.id || undefined);
      setVisibility(editingLibrary.visibility || LibraryVisibility.GENERAL);
    } else {
      setTitle('');
      setDescription('');
      setParentNoteId(currentNote?.id); // Establecer el padre por defecto
      setVisibility(LibraryVisibility.GENERAL);
    }
  }, [editingLibrary, currentNote]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const libraryData: CreateLibraryDto | UpdateLibraryDto = {
      title,
      description,
      referenceDate: editingLibrary ? editingLibrary.referenceDate : new Date(),
      parentNoteId,
      visibility,
    };

    onSubmit(libraryData);
    onHide();
  };

  const editorRef = useRef<any>(null);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onHide();
    if (editorRef.current) {
      editorRef.current.remove();
    }
  }

  const parentOptions = availableParents.map(parent => ({
    value: parent.id,
    label: parent.title
  }));

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'var(--card-color)',
      borderColor: 'var(--secondary)',
      minHeight: '38px',
      color: 'var(--font-color)',
      '&:hover': {
        borderColor: 'var(--primary)'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'var(--card-color)',
      zIndex: 9999
    }),
    menuList: (base: any) => ({
      ...base,
      backgroundColor: 'var(--card-color)',
      maxHeight: '200px'
    }),
    option: (base: any, state: { isFocused: boolean; isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'var(--primary-color)' 
        : state.isFocused 
          ? 'var(--secondary-color)' 
          : 'var(--card-color)',
      color: 'var(--font-color)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'var(--secondary-color)'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'var(--font-color)'
    }),
    input: (base: any) => ({
      ...base,
      color: 'var(--font-color)'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'var(--font-color)',
      opacity: 0.7
    })
  };

  const currentParentOption = parentNoteId ? {
    value: parentNoteId,
    label: availableParents.find(p => p.id === parentNoteId)?.title || 'Nota padre'
  } : null;

  return (
    <>
      {show && (
        <Modal show={show} onHide={onHide} size="xl">
          <Modal.Header closeButton className="border-secondary">
            <Modal.Title style={{ color: 'var(--font-color)' }}>
              {editingLibrary ? 'Editar Referencia' : 'Crear Referencia'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: 'var(--card-color)' }}>
            <Form onSubmit={(e) => {
              handleSubmit(e);
              handleClose();
            }}>
              <Row>
                <Col md={userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN ? 6 : 12}>
                  <Form.Group controlId="formLibraryTitle">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-dark text-light border-secondary"
                    />
                  </Form.Group>
                </Col>
                {(userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) && (
                  <Col md={6}>
                    <Form.Group controlId="formLibraryVisibility">
                      <Form.Label>Visibilidad</Form.Label>
                      <Form.Control
                        as="select"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as LibraryVisibility)}
                        required
                        className="bg-dark text-light border-secondary"
                      >
                        <option value={LibraryVisibility.GENERAL}>General</option>
                        <option value={LibraryVisibility.USERS}>Usuarios</option>
                        <option value={LibraryVisibility.ADMIN}>Admin</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                )}
                <Col md={12}>
                  <Form.Group controlId="formLibraryParent">
                    <Form.Label>Padre</Form.Label>
                    <Select
                      value={currentParentOption}
                      onChange={(option) => setParentNoteId(option?.value)}
                      options={parentOptions}
                      isClearable
                      isSearchable
                      placeholder="Buscar o seleccionar padre..."
                      styles={customSelectStyles}
                      noOptionsMessage={() => "No se encontraron notas"}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Form.Group controlId="formLibraryDescription">
                <Form.Label>Descripción</Form.Label>
                <CustomEditor
                  content={description}
                  setContent={setDescription}
                  templateType={TemplateType.NOTES}
                />
              </Form.Group>
              <br />
              <Button variant="primary" type="submit">
                {editingLibrary ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default LibraryFormModal;
