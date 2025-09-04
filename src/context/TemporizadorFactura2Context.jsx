//CODIGO en produccion 


import React, { createContext, useContext, useEffect, useState } from "react";

const TemporizadorFactura2Context = createContext();

export function TemporizadorFactura2Provider({ children, initialTime = 60 }) {
  const [timeLeftFactura2, setTimeLeftFactura2] = useState(initialTime);
  const [isRunningFactura2, setIsRunningFactura2] = useState(false);

  // Reducir el tiempo cada segundo SOLO si está corriendo
  useEffect(() => {
    if (!isRunningFactura2 || timeLeftFactura2 <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftFactura2((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunningFactura2, timeLeftFactura2]);

  // Función para formatear mm:ss
  const formatTimeFactura2 = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Controles del timer
  const startFactura2 = () => {
    setTimeLeftFactura2(initialTime);
    setIsRunningFactura2(true);
  };

  const resetFactura2 = () => {
    setTimeLeftFactura2(initialTime);
    setIsRunningFactura2(false);
  };

  return (
    <TemporizadorFactura2Context.Provider
      value={{
        timeLeftFactura2,
        setTimeLeftFactura2,
        formatTimeFactura2,
        isRunningFactura2,
        startFactura2,
        resetFactura2,
      }}
    >
      {children}
    </TemporizadorFactura2Context.Provider>
  );
}

// Hook para usarlo en componentes
export function useTemporizadorFactura2() {
  return useContext(TemporizadorFactura2Context);
}
