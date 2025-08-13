import React, { useState } from 'react';
import fondo from './assets/fondo.jpg'; // imagen de fondo
import kiosko from './assets/kiosko.jpg'; // logo

function Register({ onRegister, goToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Validar campos vacíos
    if (!username.trim() || !password.trim() || !apartmentNumber.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch('https://backend-1uwd.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, apartmentNumber })
      });

      const data = await res.json();

      if (data.success) {
        console.log("✅ Registro exitoso:", data);

        // ✅ Usar el apartmentNumber y username del backend si existen, si no, usar los del formulario
        const aptNum = data.apartmentNumber || apartmentNumber;
        const userNameFinal = data.username || username;

        // ✅ Guardar en localStorage antes de pasar a App.jsx
        localStorage.setItem('username', userNameFinal);
        localStorage.setItem('apartmentNumber', aptNum);

        // ✅ Llamar a App.jsx con datos correctos
        onRegister({ username: userNameFinal, apartmentNumber: aptNum });
      } else {
        setError(data.message || 'Error al registrar el usuario');
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err);
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
        backgroundColor: 'rgba(59, 63, 71, 0.85)',
        padding: '30px',
        borderRadius: '10px',
        width: 'min(90%, 300px)',
        boxSizing: 'border-box'
      }}>
        {/* Logo kiosko */}
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
            Registrarse
          </button>
        </form>

        {/* Botón para volver a login */}
        <button onClick={goToLogin} style={{
          marginTop: '10px',
          background: 'none',
          color: '#fffc33',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}>
          Volver a iniciar sesión
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;
