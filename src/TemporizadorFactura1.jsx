import React, { useEffect, useState } from 'react';

function TemporizadorFactura1({ onFinish }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('timeLeftFactura1');
    return saved !== null ? Number(saved) : 1 * 60;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onFinish) onFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  // Sincronizar con localStorage
  useEffect(() => {
    localStorage.setItem('timeLeftFactura1', timeLeft);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
      {minutes}:{seconds}
    </span>
  );
}

export default TemporizadorFactura1;

