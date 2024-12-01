import React, { useState } from 'react';
import { useAuth } from '../AuthContext';  
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { setToken } = useAuth();  // Accedemos a setToken desde el contexto
  const navigate = useNavigate();  // Usamos useNavigate para la redirección

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
  
      const token = await response.text();
      setToken(token);  // Guardamos el token en el contexto
      localStorage.setItem("token", token);  // Guardamos el token en el localStorage
      navigate('/buses');  // Redirigimos a la lista de buses
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sistema</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Introduce tu usuario"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
