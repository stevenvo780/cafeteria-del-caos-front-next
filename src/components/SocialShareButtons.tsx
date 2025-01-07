'use client';
import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'react-share';
import { FaCopy, FaCheckCircle } from 'react-icons/fa';
import { Row, Col } from 'react-bootstrap';

interface SocialShareButtonsProps {
  shareUrl: string;
  title: string;
  summary?: string;
  size?: number;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ size = 60, shareUrl, title, summary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Row className="justify-content-center">
      <Col xs={4} sm={3} md={2} className="mb-2 text-center">
        <FacebookShareButton url={shareUrl} title={title}>
          <FacebookIcon size={size} round />
        </FacebookShareButton>
      </Col>
      <Col xs={4} sm={3} md={2} className="mb-2 text-center">
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={size} round />
        </TwitterShareButton>
      </Col>
      <Col xs={4} sm={3} md={2} className="mb-2 text-center">
        <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
          <WhatsappIcon size={size} round />
        </WhatsappShareButton>
      </Col>
      <Col xs={4} sm={3} md={2} className="mb-2 text-center">
        <LinkedinShareButton url={shareUrl} title={title} summary={summary || ''} source={window.location.origin}>
          <LinkedinIcon size={size} round />
        </LinkedinShareButton>
      </Col>
      <Col xs={4} sm={3} md={2} className="mb-2 text-center">
        <TelegramShareButton url={shareUrl} title={title}>
          <TelegramIcon size={size} round />
        </TelegramShareButton>
      </Col>
      <Col xs={4} sm={3} md={2} className="mb-2 text-center">
        <button onClick={handleCopyUrl} className="btn btn-link">
          {copied ? <FaCheckCircle size={30} style={{ color: "var(--success-color)" }} /> : <FaCopy size={30} />}
        </button>
      </Col>
    </Row>
  );
};

export default SocialShareButtons;
