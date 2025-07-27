import React, { useEffect, useState } from 'react';

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function TemporizadorPrincipal({ start, initialTime = 12 * 60 * 60, onGuardarTiempo }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const restaurado = localStorage.getItem("Restaurando temporizador");

    if (restaurado) {
      localStorage.removeItem("Restaurando temporizador");
      localStorage.setItem("timeLeftPrincipal", restaurado);
      return parseInt(restaurado, 10);
    }

    const local = localStorage.getItem("timeLeftPrincipal");
    return local !== null ? parseInt(local, 10) : initialTime;
  });

  useEffect(() => {
    let interval = null;

    if (start && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const updated = prev - 1;
          localStorage.setItem('timeLeftPrincipal', updated);

          if (onGuardarTiempo) {
            onGuardarTiempo(updated);
          }

          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [start, timeLeft, onGuardarTiempo]);

  // 🔴 NO ocultes el temporizador si no está corriendo
  if (timeLeft <= 0) {
    return <div>⏳ Tiempo agotado</div>;
  }

  return (
    <div style={{ margin: '20px', fontSize: '1.2rem' }}>
      Tiempo restante: {formatTime(timeLeft)} {!start && <span>(pausado)</span>}
    </div>
  );
}

export default TemporizadorPrincipal;
