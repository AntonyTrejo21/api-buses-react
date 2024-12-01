import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { token } = useAuth();  // Usamos el token desde el contexto

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
