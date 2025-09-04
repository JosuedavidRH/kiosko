//CODIGO en produccion 


import React, { createContext, useContext, useEffect, useState } from "react";

const TemporizadorFactura1Context = createContext();

export function TemporizadorFactura1Provider({ children, initialTime = 60 }) {
  const [timeLeftFactura1, setTimeLeftFactura1] = useState(initialTime);

  // Reducir el tiempo cada segundo
  useEffect(() => {
    if (timeLeftFactura1 <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftFactura1((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftFactura1]);

  // Función para formatear mm:ss
  const formatTimeFactura1 = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <TemporizadorFactura1Context.Provider
      value={{ timeLeftFactura1, setTimeLeftFactura1, formatTimeFactura1 }}
    >
      {children}
    </TemporizadorFactura1Context.Provider>
  );
}

// Hook para usarlo en componentes
export function useTemporizadorFactura1() {
  return useContext(TemporizadorFactura1Context);
}
