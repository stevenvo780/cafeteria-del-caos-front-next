'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, Nav, Container, Dropdown, Image, Offcanvas } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/auth';
import routesConfig from '../config/routesConfig.json';
import { CgMenuGridO } from "react-icons/cg";

const Header: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    router.push('/');
  };

  const handleLoginRedirect = () => {
    router.push('/Login');
  };

  const publicRoutes = routesConfig.publicRoutes;
  const roleRoutes = userRole && routesConfig.roleRoutes[userRole as keyof typeof routesConfig.roleRoutes]
    ? routesConfig.roleRoutes[userRole as keyof typeof routesConfig.roleRoutes]
    : [];

  const combinedRoutes = [...publicRoutes, ...roleRoutes];

  const mainRoutes = combinedRoutes.filter(route => !route.hidden && route.viewHeader !== false);
  const dropdownRoutes = combinedRoutes.filter(route => route.hidden);

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  const handleRoute = (path: string) => {
    router.push(path);
    if (showSidebar) setShowSidebar(false);
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-dark" style={{
        padding: '0px',
        backgroundColor: "var(--navbar-color)",
        borderBottom: "1px solid var(--border-color)"
      }}>
        <Container fluid className="pl-4 pr-4">
            <div onClick={() => handleRoute('/')} className="navbar-brand" style={{ cursor: 'pointer' }}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                style={{ width: '50px', height: '50px', objectFit: 'contain', padding: '5px', margin: '0 15px' }}
              />
              <span style={{
                fontFamily: "Montaga",
                fontSize: "1.5rem",
                color: "var(--font-color)",
                fontWeight: "bold"
              }}>
                Cafeteria del caos
              </span>
            </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggleSidebar} />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end d-none d-lg-flex">
            <Nav>
              {mainRoutes.map((route, index) => (
                <div
                  key={index}
                  onClick={() => handleRoute(route.path)}
                  className="nav-link custom-nav-link"
                  style={{ color: "var(--font-color)", cursor: 'pointer' }}
                >
                  <p style={{ color: "var(--font-color)", margin: 0 }}>{route.name}</p>
                </div>
              ))}
            </Nav>
            <Dropdown align="end">
              <Dropdown.Toggle as="span" id="dropdown-basic" className="d-flex align-items-center" style={{ cursor: 'pointer', marginInline: 10 }}>
                <CgMenuGridO size={20} className="custom-icon" style={{ color: "var(--font-color)" }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {dropdownRoutes.map((route, index) => (
                  <Dropdown.Item 
                    key={index} 
                    onClick={() => handleRoute(route.path)}
                  >
                    {route.name}
                  </Dropdown.Item>
                ))}
                {isLoggedIn ? (
                  <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                ) : (
                  <Dropdown.Item onClick={handleLoginRedirect}>Iniciar sesión</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas 
        show={showSidebar} 
        onHide={handleToggleSidebar} 
        placement="end"
        style={{
          backgroundColor: "var(--card-color)",
          color: "var(--font-color)"
        }}
      >
        <Offcanvas.Header 
          closeButton 
          style={{
            borderBottom: "1px solid var(--border-color)",
            color: "var(--font-color)"
          }}
        >
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {mainRoutes.map((route, index) => (
              <div
                key={index}
                onClick={() => { handleRoute(route.path); handleToggleSidebar(); }}
                className="nav-link custom-nav-link"
                style={{ color: "var(--font-color)", cursor: 'pointer' }}
              >
                {route.name}
              </div>
            ))}
            <Dropdown.Divider />
            {dropdownRoutes.map((route, index) => (
              <div
                key={index}
                onClick={() => { handleRoute(route.path); handleToggleSidebar(); }}
                className="nav-link"
                style={{ color: "var(--font-color)", cursor: 'pointer' }}
              >
                {route.name}
              </div>
            ))}
            <Dropdown.Divider />
            {isLoggedIn ? (
              <Nav.Link onClick={() => { handleLogout(); handleToggleSidebar(); }} style={{
                backgroundColor: "var(--primary-color)",
                borderRadius: "5px",
              }}>
                <p style={{ margin: 0, color: "var(--primary-text)", }}>Cerrar sesión</p>
              </Nav.Link>
            ) : (
              <Nav.Link onClick={() => { handleLoginRedirect(); handleToggleSidebar(); }} style={{
                backgroundColor: "var(--primary-color)",
                borderRadius: "5px",
              }}>
                <p style={{ margin: 0, color: "var(--primary-text)", }}>Iniciar sesión</p>
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
