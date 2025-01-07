'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import api from '@/utils/axios';
import { addNotification } from '@/redux/ui';

interface Product {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  stock: number | null;
  totalSlots: number | null;
  scarcityMultiplier: number | null;
}

interface ProductModalProps {
  show: boolean;
  onHide: () => void;
  product: Product | null;
  onSave: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onHide,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    basePrice: 0,
    stock: null,
    totalSlots: null,
    scarcityMultiplier: null,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        title: '',
        description: '',
        basePrice: 0,
        stock: null,
        totalSlots: null,
        scarcityMultiplier: null,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        await api.patch(`/products/${product.id}`, formData);
        dispatch(addNotification({ message: 'Producto actualizado correctamente', color: 'success' }));
      } else {
        await api.post('/products', formData);
        dispatch(addNotification({ message: 'Producto creado correctamente', color: 'success' }));
      }
      onSave();
      onHide();
    } catch (error) {
      console.error('Error saving product:', error);
      dispatch(addNotification({ 
        message: `Error al ${product ? 'actualizar' : 'crear'} el producto`, 
        color: 'danger' 
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number | null = value;

    if (name === 'stock' || name === 'totalSlots') {
      finalValue = value === '' ? null : parseInt(value);
    } else if (name === 'basePrice' || name === 'scarcityMultiplier') {
      finalValue = value === '' ? null : parseFloat(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
              rows={3}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Base</Form.Label>
            <Form.Control
              type="number"
              name="basePrice"
              value={formData.basePrice || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock (dejar vacío para infinito)</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock === null ? '' : formData.stock}
              onChange={handleChange}
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total de Slots</Form.Label>
            <Form.Control
              type="number"
              name="totalSlots"
              value={formData.totalSlots === null ? '' : formData.totalSlots}
              onChange={handleChange}
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Multiplicador de Escasez</Form.Label>
            <Form.Control
              type="number"
              name="scarcityMultiplier"
              value={formData.scarcityMultiplier === null ? '' : formData.scarcityMultiplier}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {product ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
