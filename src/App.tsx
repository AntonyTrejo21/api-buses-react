import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';  // Usamos useNavigate para redirigir
import { AuthProvider, useAuth } from './components/AuthContext';  // Proveedor de contexto de autenticación
import Login from './components/Login/Login';  // Página de login
import ProtectedRoute from './components/ProtectedRoute';  // Componente para proteger rutas
import BusesList from './components/BusList/BusList';  // Componente de buses
import BusDetail from './components/BusDetail/BusDetail';  // Detalle del bus
import ViajeList from './components/ViajeList/ViajeList';  // Lista de viajes
import ViajeDetail from './components/ViajeDetail/ViajeDetail';  // Detalle del viaje

const AppRoutes: React.FC = () => {
  const { token } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/buses" element={<ProtectedRoute element={<BusesList />} />} />
      <Route path="/bus/:id" element={<ProtectedRoute element={<BusDetail />} />} />
      <Route path="/viajes" element={<ProtectedRoute element={<ViajeList />} />} />
      <Route path="/viaje/:idViaje" element={<ProtectedRoute element={<ViajeDetail />} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes /> 
    </AuthProvider>
  );
};

export default App;
