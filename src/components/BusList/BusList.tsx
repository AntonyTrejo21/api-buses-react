import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import './BusList.css';  

interface Bus {
  id: number;
  numero: number;  
  placa: string;
  fechaCreacion: string; 
  caracteristicas: string;
  marca: { nombre: string };  
  estado: boolean;  
}

interface BusPageResponse {
  buses: Bus[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const BusList = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); 
  const [totalPages, setTotalPages] = useState<number>(0); 
  const [pageSize, setPageSize] = useState<number>(10); 

  const { token } = useAuth(); 

  const fetchBuses = useCallback((page: number) => {
    if (!token) {
      setError('Token no disponible');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/buses?page=${page}&size=${pageSize}`, {
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
      .then((data: BusPageResponse) => {
        setBuses(data.buses);
        setCurrentPage(data.currentPage); 
        setTotalPages(data.totalPages); 
        setLoading(false);
      })
      .catch(error => {
        setError(error.message || 'Error al obtener los buses');
        setLoading(false);
      });
  }, [token, pageSize]);  

  useEffect(() => {
    console.log("Token en BusList:", token); // Verifica que el token esté aquí
    fetchBuses(currentPage);
  }, [currentPage, fetchBuses, token]); // Asegúrate de que token esté en las dependencias
  

  /*const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.reload(); 
  };*/
  
  if (loading) {
    return <div className="loading">Cargando...</div>; 
  }

  if (error) {
    return <div className="error">{error}</div>;  
  }

  return (
    <div>
      <h2 className="list-title">Lista de Buses</h2>
      <table className="bus-table">
        <thead className='table-head'>
          <tr>
            <th>ID</th>
            <th>Número de Bus</th>
            <th>Placa</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id}>
              <td>{bus.id}</td>
              <td>{bus.numero}</td>
              <td>{bus.placa}</td>
              <td>
                <Link to={`/bus/${bus.id}`}>Ver Detalles</Link> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          className="pagination-btn"
          disabled={currentPage === 0} 
          onClick={() => setCurrentPage(currentPage - 1)} >
          Anterior
        </button>
        <span className="pagination-span">
          Página {currentPage + 1} de {totalPages}
        </span>
        <button 
          className="pagination-btn"
          disabled={currentPage === totalPages - 1} 
          onClick={() => setCurrentPage(currentPage + 1)} >
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
            className="page-size-select">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </label>
      </div>
      <button className="logout-btn" /*onClick={handleLogout}*/>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default BusList;