import React, { useState } from 'react';
import fondo from './assets/fondo.jpg'; // imagen de fondo
import kiosko from './assets/kiosko.jpg'; // logo que quieres arriba del formulario

function Login({ onLogin, goToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // conexión local para desarrollo
      const res = await fetch('https://backend-1uwd.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {

        console.log("Login exitoso:", data); // Verificación visual
        onLogin({ username: data.username, apartmentNumber: data.apartmentNumber });
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(59, 63, 71, 0.85)',  // semi-transparente para ver el fondo
        padding: '30px',
        borderRadius: '10px',
        width: 'min(90%, 300px)',
        boxSizing: 'border-box'
      }}>
        {/* imagen kiosko en la parte superior */}
        <img 
          src={kiosko} 
          alt="Kiosko logo"
          style={{
            width: '290px',
            height: '130px',
            objectFit: 'cover',
            borderRadius: '110%',
            marginBottom: '20px'
          }}
        />

        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)'
        }}>Iniciar sesión</h2>

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
            Ingresar
          </button>
        </form>

        {/* Botón para registrarse */}
        <button onClick={goToRegister} style={{
          marginTop: '10px',
          background: 'none',
          color: '#fffc33',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}>
          Registrarse
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
