'use client';
import React from 'react';
import { Container } from 'react-bootstrap';
import "./styles.css";

const DebatesView: React.FC = () => {
  return (
    <Container fluid className="p-0">
      <div className="iframe-container">
        <iframe
          src="https://orquestador-debates.vercel.app/"
          className="debates-iframe"
          title="Debates"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Container>
  );
};

export default DebatesView;
