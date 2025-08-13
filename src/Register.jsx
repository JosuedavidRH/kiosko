import React, { useState } from 'react';
import fondo from './assets/fondo.jpg'; // imagen de fondo

function Register({ onRegister, goToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://backend-1uwd.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, apartmentNumber })
      });

      const data = await res.json();

      if (data.success) {
        // Guardar directamente en localStorage antes de cambiar de vista
        localStorage.setItem('apartmentNumber', data.apartmentNumber);

        // Mantener tu lógica original
        onRegister({ username: data.username, apartmentNumber: data.apartmentNumber });
        
        // Cambiar a login
        goToLogin();
      } else {
        setError(data.message || 'No se pudo registrar');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(59, 63, 71, 0.85)',
        padding: '30px',
        borderRadius: '10px',
        width: 'min(90%, 300px)',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
          color: '#fff'
        }}>Registrarse</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%'
        }}>
          <input 
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
          <input 
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
          <input 
            type="text"
            placeholder="Número de apartamento"
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
          <button type="submit" style={{
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#fffc33',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Registrar
          </button>
        </form>
        <button onClick={goToLogin} style={{
          marginTop: '10px',
          background: 'none',
          color: '#fffc33',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}>
          Volver al Login
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;
