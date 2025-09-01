

//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects2\myapp2\kiosko_local\src\SegundaPagina.jsx" solo analizalo no modifiques nada  


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

// IMPORTAMOS restaurarDatos
import { restaurarDatos2 } from "./utils/restaurarDatos2"; 

function generarTresCodigos() {
  return Array.from({ length: 3 }, () =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );
}

function SegundaPagina() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Primero intentamos sacar el user del state, si no existe lo tomamos de localStorage
  const user = location.state?.user || localStorage.getItem('user');

  const [codigos, setCodigos] = useState([]);
  const [indexActual, setIndexActual] = useState(0);

  // 🔹 Intentamos restaurar datos primero
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const cargarDatos = async () => {
      try {
        // 🔹 1) PRIORIDAD: Si BotonPrincipal mandó codigos en navigate()
        const codigosState = location.state?.codigos;

        if (codigosState && Array.isArray(codigosState)) {
          console.log("✅ Restaurando datos desde state:", codigosState);

          setCodigos(codigosState);

          // ✅ Siempre arrancamos desde el primer código
          setIndexActual(0);

          // Guardar en localStorage para consistencia
          localStorage.setItem('codigos', JSON.stringify(codigosState));
          localStorage.setItem('indexActual', '0');
          return; // 🔥 Importante: No seguimos al backend si ya tenemos los códigos válidos
        }

        // 🔹 2) Si no vienen en state, intentamos restaurar desde backend
        const restaurados = await restaurarDatos2(user);

        if (restaurados && restaurados.codigos?.length > 0) {
          console.log("✅ Restaurando datos desde backend:", restaurados);

          setCodigos(restaurados.codigos);

          // ✅ Siempre arrancamos desde el primer código
          setIndexActual(0);

          localStorage.setItem("codigos", JSON.stringify(restaurados.codigos));
          localStorage.setItem("indexActual", "0");
        } else {
          // 🔹 3) Si no hay en backend, revisamos localStorage
          const codigosGuardados = JSON.parse(localStorage.getItem('codigos'));
          const indexGuardado = parseInt(localStorage.getItem('indexActual'), 10);

          if (
            codigosGuardados &&
            Array.isArray(codigosGuardados) &&
            !isNaN(indexGuardado) &&
            indexGuardado < 3
          ) {
            setCodigos(codigosGuardados);

            // ✅ Siempre arrancamos desde el primer código
            setIndexActual(0);

            localStorage.setItem('codigos', JSON.stringify(codigosGuardados));
            localStorage.setItem('indexActual', '0');
          } else {
            // 🔹 4) Si tampoco hay, generamos nuevos
            const nuevos = generarTresCodigos();
            setCodigos(nuevos);
            setIndexActual(0);
            localStorage.setItem('codigos', JSON.stringify(nuevos));
            localStorage.setItem('indexActual', '0');
          }
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, [user, navigate, location.state]);

  const qrActual = codigos[indexActual];

  const manejarVolver = () => {
    const nuevoIndex = indexActual + 1;

    if (nuevoIndex < 3) {
      localStorage.setItem('indexActual', nuevoIndex.toString());
    } else {
      const nuevosCodigos = generarTresCodigos();
      localStorage.setItem('codigos', JSON.stringify(nuevosCodigos));
      localStorage.setItem('indexActual', '0');
    }

    navigate('/');
  };

  return (
    <div style={{ 
      backgroundColor: 'white',  
      color: 'black',            
      textAlign: 'center', 
      paddingTop: '50px',
      minHeight: '100vh'        
    }}>
      <h2 style={{ marginBottom: '30px' }}>
        Bienvenido {user} a la segunda página
      </h2>

      {/* Mostrar los 3 códigos en fila */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {codigos.map((code, i) => (
          <div
            key={i}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: i === indexActual ? '#00c0ff' : '#f0f0f0',
              fontWeight: 'bold',
              fontSize: '1.3rem'
            }}
          >
            {code}
          </div>
        ))}
      </div>

      {/* Mostrar QR actual */}
      {qrActual ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <QRCode 
            value={`${user}|${qrActual}`}   // ✅ Formato "302|548921"
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      ) : (
        <p>No hay más QR para mostrar.</p>
      )}

      <button
        onClick={manejarVolver}
        style={{
          marginTop: '60px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '90px',
          width: '160px',
          height: '160px',
          padding: '40px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}
      >
        Volver a la página principal
      </button>
    </div>
  );
}

export default SegundaPagina;
