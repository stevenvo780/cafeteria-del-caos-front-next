'use client';
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import routesConfig from '../config/routesConfig.json';

const loadComponent = (componentName: string) => {
  return lazy(() => import(`../views/${componentName}`));
};

const generateRoutes = (routes: { path: string; element: string }[]) => {
  return routes.map(({ path, element }) => {
    const Component = loadComponent(element);
    return <Route key={path} path={path} element={<Component />} />;
  });
};

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: 50 }}>
    <h1>404</h1>
    <p>Página no encontrada</p>
  </div>
);

const AuthWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.userData);
  const publicRoutes = routesConfig.publicRoutes;
  const role = user?.role as string | undefined;
  const roleRoutes = role ? routesConfig.roleRoutes[role as keyof typeof routesConfig.roleRoutes] : [];

  const combinedRoutes = [...publicRoutes, ...(roleRoutes || [])];

  return (
    <Layout>
      <div style={{ margin: 10 }}>
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            {generateRoutes(combinedRoutes)}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Layout>
  );
};

export default AuthWrapper;
