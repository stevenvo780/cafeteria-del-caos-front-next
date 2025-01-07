/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import Slider from 'react-slick';
import { Card, Col } from 'react-bootstrap';
import { FaBook, FaFeatherAlt, FaGlasses, FaNewspaper, FaPenFancy, FaScroll, FaUniversity, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Events } from '../utils/types';
import { useRouter } from 'next/navigation';
import { BsBookHalf, BsBook, BsJournalBookmark, BsPen } from 'react-icons/bs';
import { GiBookshelf, GiBookmark, GiQuillInk, GiOpenBook, GiScrollUnfurled, GiBrain, GiSpellBook } from 'react-icons/gi';
import { MdLibraryBooks, MdMenuBook, MdOutlineAutoStories, MdOutlineClass, MdOutlineSchool } from 'react-icons/md';
import { IoBookSharp, IoSchoolSharp, IoJournal, IoNewspaperSharp } from 'react-icons/io5';
import { RiArticleLine, RiBookLine, RiBookOpenLine, RiPencilLine } from 'react-icons/ri';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const iconList = [
  FaBook, FaFeatherAlt, FaPenFancy, FaScroll, FaGlasses, FaUniversity, FaNewspaper,
  GiBookshelf, GiBookmark, GiQuillInk, GiOpenBook, GiScrollUnfurled, GiBrain, GiSpellBook,
  MdLibraryBooks, MdMenuBook, MdOutlineAutoStories, MdOutlineClass, MdOutlineSchool,
  IoBookSharp, IoSchoolSharp, IoJournal, IoNewspaperSharp,
  BsBookHalf, BsBook, BsJournalBookmark, BsPen,
  RiBookOpenLine, RiBookLine, RiArticleLine, RiPencilLine
];

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

interface ScrollableEventsProps {
  events: Events[];
}

const ScrollableEvents: React.FC<ScrollableEventsProps> = ({ events }) => {
  const router = useRouter();
  let iconIndex = 0;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleEventClick = (eventId: number | null) => {
    if (eventId !== null) {
      router.push(`/events/${eventId}`);
    }
  };

  return (
    <Slider {...settings}>
      {events.length > 0 ? (
        events.map((event) => {
          const IconComponent = iconList[iconIndex % iconList.length];
          iconIndex++;
          return (
            <div key={event.id}>
              <Col style={{ padding: 15 }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => handleEventClick(event.id as number | null)}
                >
                  <IconComponent size={82} style={{ marginBottom: '10px' }} />
                  <Card
                    className='card-events-home'
                    style={{ minWidth: '100%', marginBottom: '10px' }}
                  >
                    <Card.Body className="d-flex flex-column align-items-center" style={{ padding: 5 }}>
                      <Card.Title>{event.title}</Card.Title>
                      <Card.Text>
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.startDate).toLocaleTimeString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </div>
          );
        })
      ) : (
        <p>No hay eventos recurrentes</p>
      )}
    </Slider>
  );
};

export default ScrollableEvents;
