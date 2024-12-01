import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './ViajeList.css';

interface Viaje {
  idViaje: number;
  origen: { id: number; nombre: string; departamento: string };
  destino: { id: number; nombre: string; departamento: string };
  fechaSalida: string;
  fechaLlegadaEstimada: string;
  precio: number;
  asientosDisponibles: number;
}

interface ViajePageResponse {
  viajes: Viaje[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const ViajeList = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { token } = useAuth();

  const fetchViajes = useCallback(
    (page: number) => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Token no disponible');
        setLoading(false);
        return;
      }

      fetch(`http://localhost:8080/viajes?page=${page}&size=${pageSize}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.status}`);
          }
          return response.json();
        })
        .then((data: ViajePageResponse) => {
          setViajes(data.viajes);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        })
        .catch((error) => {
          setError(error.message || 'Error al obtener los viajes');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [token, pageSize]
  );

  useEffect(() => {
    fetchViajes(currentPage);
  }, [currentPage, fetchViajes]);

  const reservarViaje = async (idViaje: number, numeroAsiento: number) => {
    if (!token) {
      alert('Token no disponible');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/reservar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idViaje, numeroAsiento }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Error al reservar viaje: ${errorMessage}`);
      } else {
        alert('¡Reserva realizada con éxito!');
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <>
      <h2 className="list-title">Lista de Viajes</h2>
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <table className="viaje-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Fecha de Salida</th>
                <th>Fecha de Llegada</th>
                <th>Detalles</th>
                <th>Comprar</th>
              </tr>
            </thead>
            <tbody>
              {viajes.map((viaje) => (
                <tr key={viaje.idViaje}>
                  <td>{viaje.idViaje}</td>
                  <td>{viaje.origen.nombre}</td>
                  <td>{viaje.destino.nombre}</td>
                  <td>{new Date(viaje.fechaSalida).toLocaleString()}</td>
                  <td>{new Date(viaje.fechaLlegadaEstimada).toLocaleString()}</td>
                  <td>
                    <Link to={`/viaje/${viaje.idViaje}`}>Ver Detalles</Link>
                  </td>
                  <td>
                    <button onClick={() => reservarViaje(viaje.idViaje, 20)}>Comprar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </button>
            <span className="pagination-span">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>

          <div>
            <label className="page-size-label">
              Tamaño de página:
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(0);
                }}
                className="page-size-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </label>
          </div>
        </>
      )}
    </>
  );
};

export default ViajeList;
