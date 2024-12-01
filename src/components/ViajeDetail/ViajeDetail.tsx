import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../AuthContext';
import './ViajeDetail.css'; 

interface Viaje {
    idViaje: number;
    origen: { id: number; nombre: string; departamento: string };
    destino: { id: number; nombre: string; departamento: string };
    fechaSalida: string;
    fechaLlegadaEstimada: string;
    bus: { id: number; placa: string; numero: number };
    precio: number;
    asientosDisponibles: number;
  }

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.log('Fecha inválida');
    return 'Fecha inválida';
  }
  return format(date, 'dd/MM/yyyy HH:mm:ss');
};

const ViajeDetail = () => {
  const { idViaje } = useParams();
  const [viaje, setViaje] = useState<Viaje | null>(null);
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

    fetch(`http://localhost:8080/viaje/${idViaje}`, {
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
        setViaje(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message || 'Error al obtener los detalles del bus');
        setLoading(false);
      });
  }, [idViaje,token]);

  if (loading) {
    return <div className="loading">Cargando detalles del bus...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleGoBack = () => {
    navigate('/viajes'); 
  };

  return (
    <div className="viaje-detail-container">
      {viaje ? (
        <div>
          <h2>Detalles del Viaje</h2>
          <p><strong>Id de viaje:</strong> {viaje.idViaje}</p>
          <p><strong>Origen:</strong> {viaje.origen.nombre}</p>
          <p><strong>Destino:</strong> {viaje.destino.nombre}</p>
          <p><strong>Fecha de salida:</strong> {formatDate(viaje.fechaSalida)}</p>
          <p><strong>Fecha de llegada:</strong> {formatDate(viaje.fechaLlegadaEstimada)}</p>
          <p><strong>Bus:</strong> {viaje.bus.placa}</p>
          <p><strong>Precio:</strong> {viaje.precio}</p>
          <p><strong>Asientos disponibles:</strong> {viaje.asientosDisponibles}</p>
          <div className="button-container">
            <button onClick={handleGoBack}>Regresar al listado</button>
          </div>
        </div>
      ) : (
        <p>No se encontraron detalles del Viaje.</p>
      )}
    </div>
  );
};

export default ViajeDetail;