import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../AuthContext';
import './BusDetail.css'; 

interface Bus {
  id: number;
  numero: number;
  placa: string;
  fecha_creacion: string;
  caracteristicas: string;
  marca: { nombre: string };
  estado: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.log('Fecha inválida');
    return 'Fecha inválida';
  }
  return format(date, 'dd/MM/yyyy HH:mm:ss');
};

const BusDetail = () => {
  const { id } = useParams();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth();  
  useEffect(() => {
    if (!token) {
      setError('Token no disponible');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/bus/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la respuesta de la API: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setBus(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message || 'Error al obtener los detalles del bus');
        setLoading(false);
      });
  }, [id,token]);

  if (loading) {
    return <div className="loading">Cargando detalles del bus...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleGoBack = () => {
    navigate('/buses'); 
  };

  return (
    <div className="bus-detail-container">
      {bus ? (
        <div>
          <h2>Detalles del Bus</h2>
          <p><strong>Número de Bus:</strong> {bus.numero}</p>
          <p><strong>Placa:</strong> {bus.placa}</p>
          <p><strong>Fecha de Creación:</strong> {formatDate(bus.fecha_creacion)}</p>
          <p><strong>Características:</strong> {bus.caracteristicas}</p>
          <p><strong>Marca:</strong> {bus.marca.nombre}</p>
          <p><strong>Estado:</strong> {bus.estado ? 'Activo' : 'Inactivo'}</p>
          <div className="button-container">
            <button onClick={handleGoBack}>Regresar al listado</button>
          </div>
        </div>
      ) : (
        <p>No se encontraron detalles del bus.</p>
      )}
    </div>
  );
};

export default BusDetail;