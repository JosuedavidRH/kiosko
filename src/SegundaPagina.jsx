import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

function generarTresCodigos() {
  return Array.from({ length: 3 }, () =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );
}

function SegundaPagina({ user }) {
  const navigate = useNavigate();
  const [codigos, setCodigos] = useState([]);
  const [indexActual, setIndexActual] = useState(0);

  // Cargar datos desde localStorage y reiniciar si ya terminó la tanda de 3
  useEffect(() => {
    console.log("🔎 [SegundaPagina] user recibido:", user);

    if (!user) {
      console.warn("⚠️ No hay user, redirigiendo al inicio...");
      navigate('/');
      return;
    }

    const codigosGuardados = JSON.parse(localStorage.getItem('codigos'));
    const indexGuardado = parseInt(localStorage.getItem('indexActual'), 10);

    console.log("📦 Codigos guardados en localStorage:", codigosGuardados);
    console.log("📦 Index guardado en localStorage:", indexGuardado);

    if (
      codigosGuardados &&
      Array.isArray(codigosGuardados) &&
      !isNaN(indexGuardado) &&
      indexGuardado < 3
    ) {
      setCodigos(codigosGuardados);
      setIndexActual(indexGuardado);
      console.log("✅ Se cargaron los códigos existentes:", codigosGuardados, "Index actual:", indexGuardado);
    } else {
      const nuevos = generarTresCodigos();
      setCodigos(nuevos);
      setIndexActual(0);
      localStorage.setItem('codigos', JSON.stringify(nuevos));
      localStorage.setItem('indexActual', '0');
      console.log("🆕 Generados nuevos códigos:", nuevos);
    }
  }, [user, navigate]);

  const qrActual = user?.apartmentNumber ? `${user.apartmentNumber}|${codigos[indexActual]}` : '';

  console.log("🎯 qrActual:", qrActual);
  console.log("👉 codigos:", codigos);
  console.log("👉 indexActual:", indexActual);

  const manejarVolver = () => {
    const nuevoIndex = indexActual + 1;
    console.log("🔄 manejando volver → nuevoIndex:", nuevoIndex);

    if (nuevoIndex < 3) {
      localStorage.setItem('indexActual', nuevoIndex.toString());
      console.log("📥 Guardado nuevo index en localStorage:", nuevoIndex);
    } else {
      const nuevosCodigos = generarTresCodigos();
      localStorage.setItem('codigos', JSON.stringify(nuevosCodigos));
      localStorage.setItem('indexActual', '0');
      console.log("🆕 Reinicio de códigos:", nuevosCodigos);
    }

    navigate('/');
  };

  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh', textAlign: 'center', paddingTop: '50px' }}>
      <h2 style={{ marginBottom: '30px' }}>Bienvenido a la segunda página</h2>

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
              backgroundColor: i === indexActual ? '#00c0ff' : '#333',
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
          <QRCode value={qrActual} size={200} bgColor="#ffffff" fgColor="#000000" />
        </div>
      ) : (
        <p>⚠️ No hay más QR para mostrar.</p>
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

