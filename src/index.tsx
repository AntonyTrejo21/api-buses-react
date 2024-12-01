import React from 'react';
import ReactDOM from 'react-dom/client'; // Asegúrate de usar `react-dom/client` para React 18+
import './index.css';
import App from './App'; // El archivo principal donde están las rutas
import { BrowserRouter } from 'react-router-dom'; // Asegúrate de envolver tu App con BrowserRouter

// Usando React 18 con root API
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Renderiza la aplicación dentro de BrowserRouter para habilitar las rutas
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
