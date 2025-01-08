'use client';
import React from 'react';
import { Col, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { IoIosArrowBack } from "react-icons/io";
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Library } from '@/utils/types';

interface LibraryHeaderProps {
  currentNote: Library | null;
  onGoBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreate: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
  permissionsEditable: boolean;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  currentNote,
  onGoBack,
  onEdit,
  onDelete,
  onCreate,
  searchQuery,
  setSearchQuery,
  handleSearch,
  permissionsEditable,
}) => {
  const isMobile = window.innerWidth < 768;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <Row>
      {!currentNote && (
        <Col xs={permissionsEditable ? 9 : 10} md={permissionsEditable ? 11 : 12}>
          <Form className="mb-4" onSubmit={handleSearchSubmit}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar en la biblioteca"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark text-light border-secondary"
              />
              <Button variant="primary" type="submit">
                Buscar
              </Button>
            </InputGroup>
          </Form>
        </Col>
      )}
      {currentNote && (
        <Col xs={4} md={10}>
          <Button variant="secondary" onClick={onGoBack} className="p-0">
            <IoIosArrowBack size={30} color='var(--white-color)' />
          </Button>
        </Col>
      )}
      {permissionsEditable && (
        <Col xs={currentNote ? 8 : 3} md={currentNote ? 2 : 1} style={(isMobile && currentNote) ? {
          display: 'inline-flex',
          justifyContent: 'flex-end',
        } : {}}>
          <div style={{
            display: 'inline-flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'var(--card-color)',
            borderRadius: '10px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '10px',
          }}>
            <BsFileEarmarkPlusFill
              onClick={onCreate}
              size={27}
              style={{
                cursor: 'pointer',
                marginInline: 8,
                color: 'var(--white-color)',
              }}
            />
            {currentNote && (
              <>
                <FaEdit
                  onClick={onEdit}
                  size={27}
                  style={{
                    cursor: 'pointer',
                    marginInline: 8,
                    color: 'var(--white-color)',
                  }}
                />
                <FaTrash
                  onClick={onDelete}
                  size={27}
                  style={{
                    cursor: 'pointer',
                    marginInline: 8,
                    color: 'var(--white-color)',
                  }}
                />
              </>
            )}
          </div>
        </Col>
      )}
    </Row>
  );
};

export default LibraryHeader;
