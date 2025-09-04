//CODIGO en produccion 

import React, { createContext, useContext, useEffect, useState } from "react";

const TemporizadorFactura3Context = createContext();

export function TemporizadorFactura3Provider({ children, initialTime = 60 }) {
  const [timeLeftFactura3, setTimeLeftFactura3] = useState(initialTime);
  const [isRunningFactura3, setIsRunningFactura3] = useState(false);

  // Reducir el tiempo cada segundo SOLO si está corriendo
  useEffect(() => {
    if (!isRunningFactura3 || timeLeftFactura3 <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftFactura3((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunningFactura3, timeLeftFactura3]);

  // Función para formatear mm:ss
  const formatTimeFactura3 = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Controles del timer
  const startFactura3 = () => {
    setTimeLeftFactura3(initialTime);
    setIsRunningFactura3(true);
  };

  const resetFactura3 = () => {
    setTimeLeftFactura3(initialTime);
    setIsRunningFactura3(false);
  };

  return (
    <TemporizadorFactura3Context.Provider
      value={{
        timeLeftFactura3,
        setTimeLeftFactura3,
        formatTimeFactura3,
        isRunningFactura3,
        startFactura3,
        resetFactura3,
      }}
    >
      {children}
    </TemporizadorFactura3Context.Provider>
  );
}

// Hook para usarlo en componentes
export function useTemporizadorFactura3() {
  return useContext(TemporizadorFactura3Context);
}
