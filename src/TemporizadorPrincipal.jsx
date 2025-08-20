import React, { useEffect, useState } from 'react';

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function TemporizadorPrincipal({ start, initialTime = 1 * 60, onGuardarTiempo, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const restaurado = localStorage.getItem("Restaurando temporizador");

    if (restaurado) {
      localStorage.removeItem("Restaurando temporizador");
      localStorage.setItem("timeLeftPrincipal", restaurado);
      return parseInt(restaurado, 10);
    }

   

  useEffect(() => {
    let interval = null;

    if (start && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const updated = prev - 1;
          //localStorage.setItem('timeLeftPrincipal', updated);

          if (onGuardarTiempo) {
            onGuardarTiempo(updated);
          }

          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [start, timeLeft, onGuardarTiempo]);

  // 🆕 Detectar cuando llega a 0 sin romper la lógica original
useEffect(() => {
  if (timeLeft === 0 && onFinish) {
    onFinish(); // Esto se ejecuta solo cuando llega exactamente a 0
  }
}, [timeLeft, onFinish]);

// ✅ El temporizador siempre se muestra, incluso si está en 00:00
return (
  <div style={{ margin: '20px', fontSize: '1.2rem' }}>
    <span style={{ fontSize: '0.8rem', color: 'white' }}>
      TIENES {initialTime === 60 ? '1 MINUTO' : `${Math.floor(initialTime / 3600)} HORAS`} PARA PAGAR:
    </span>{' '}
    {formatTime(Math.max(timeLeft, 0))} {/* Nunca baja de 00:00 */}
    {!start && <span></span>}
  </div>
);


  return (
    <div style={{ margin: '20px', fontSize: '1.2rem' }}>
      <span style={{ fontSize: '0.8rem', color: 'white' }}>
        TIENES 12 HORAS PARA PAGAR: 
      </span>{' '}
      {formatTime(timeLeft)} {!start && <span></span>}
    </div>
  );
}

export default TemporizadorPrincipal;
