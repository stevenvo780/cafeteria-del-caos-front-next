/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Container, Col, Card } from 'react-bootstrap';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from '@/utils/axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TemplateSliderProps {
  templateType: string;
  onTemplateClick: (templateContent: string) => void;
}

const CustomPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronLeft
      className={className}
      style={{ ...style, display: "block", fontSize: "40px", color: "var(--primary-color)" }}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronRight
      className={className}
      style={{ ...style, display: "block", fontSize: "40px", color: "var(--primary-color)" }}
      onClick={onClick}
    />
  );
};

const TemplateSlider: React.FC<TemplateSliderProps> = ({ templateType, onTemplateClick }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/template?type=${templateType || ''}`);
        if (response.data) {
          setTemplates(response.data);
        } else {
          setError('Error al cargar templates');
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Error al cargar templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [templateType]);

  const sliderSettings = {
    dots: templates.length > 1,
    infinite: templates.length > 1,
    speed: 500,
    slidesToShow: Math.min(templates.length, 3),
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(templates.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h5>Selecciona una plantilla</h5>
      {loading && <p>Cargando plantillas...</p>}
      {error && <p>{error}</p>}
      {templates.length > 0 ? (
        <Slider {...sliderSettings}>
          {templates.map((template) => (
            <div key={template.id}>
              <Col
                style={{
                  cursor: 'pointer',
                  padding: 15,
                }}
                onClick={() => onTemplateClick(template.content)}
              >
                <Card style={{
                  minWidth: '100%',
                  marginBottom: '10px',
                  backgroundColor: 'var(--primary-color)',
                }}>
                  <Card.Body className="d-flex flex-column align-items-center" style={{ padding: 10 }}>
                    <Card.Title style={{ color: 'var(--primary-text)' }}>{template.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No hay plantillas disponibles</p>
      )}
    </Container>
  );
};

export default TemplateSlider;
