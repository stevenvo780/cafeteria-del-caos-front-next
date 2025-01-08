/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash, FaCoins } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import api from '@/utils/axios';
import { addNotification } from '@/redux/ui';
import { UserRole } from '@/utils/types';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  stock: number | null;
  totalSlots: number | null;
  scarcityMultiplier: number | null;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch(addNotification({ message: 'Error al cargar los productos', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await api.delete(`/products/${id}`);
        await fetchProducts();
        dispatch(addNotification({ message: 'Producto eliminado correctamente', color: 'success' }));
      } catch (error) {
        console.error('Error deleting product:', error);
        dispatch(addNotification({ message: 'Error al eliminar el producto', color: 'danger' }));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      {isSuperAdmin && (
        <div className="d-flex justify-content-end mb-4">
          <Button variant="primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Añadir Producto
          </Button>
        </div>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">ID: {product.id}</span>
                {isSuperAdmin && (
                  <div>
                    <Button
                      variant="link"
                      className="p-0 me-2"
                      onClick={() => handleEdit(product)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="link"
                      className="p-0 text-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <FaCoins className="text-warning me-2" />
                    <strong>{product.currentPrice}</strong>
                  </div>
                  <div className="text-muted">
                    Stock: {product.stock === null ? '∞' : product.stock}
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {showModal && (
        <ProductModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={selectedProduct}
          onSave={fetchProducts}
        />
      )}
    </Container>
  );
};

export default ProductsPage;
