'use client';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTiktok, FaYoutube, FaTwitter, FaGlobe } from 'react-icons/fa';

const ProjectSocialLinks: React.FC = () => {
  return (
    <div style={{ marginTop: '1rem', padding: '1rem' }}>
      <h5>Nuestras Redes</h5>
      <Row className="text-center" style={{ marginTop: '1rem' }}>
        <Col xs={4} sm={2}>
          <a
            href="https://www.facebook.com/share/18ZfbANxtt/?mibextid=qi2Omg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={30} />
          </a>
        </Col>
        <Col xs={4} sm={2}>
          <a
            href="https://www.tiktok.com/@cafeteriadelcaos?_t=ZM-8ss70SvHI2v&_r=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok size={30} />
          </a>
        </Col>
        <Col xs={4} sm={2}>
          <a
            href="https://youtube.com/@cafeteriadelcaos?si=mcShGmbDcyEg2tUq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={30} />
          </a>
        </Col>
        <Col xs={4} sm={2}>
          <a
            href="https://x.com/CafeteriaCaos?t=yI2qsHEdFY7cKRA4zZDEjQ&s=09"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={30} />
          </a>
        </Col>
        <Col xs={4} sm={2}>
          <a
            href="https://www.cafeteriadelcaos.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGlobe size={30} />
          </a>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectSocialLinks;
