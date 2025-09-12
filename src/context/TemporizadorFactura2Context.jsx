//CODIGO en produccion 


import React, { createContext, useContext, useEffect, useState } from "react";

const TemporizadorFactura2Context = createContext();

export function TemporizadorFactura2Provider({ children, initialTime = 1200 }) { // ⬅️ 20 minutos = 1200s
  //  Leer localStorage incluso si es "0"
  const [timeLeftFactura2, setTimeLeftFactura2] = useState(() => {
    const saved = localStorage.getItem("timeLeftFactura2");
    return saved !== null ? parseInt(saved, 10) : initialTime;
  });

  //  isRunning inicial si había valor > 0 guardado
  const [isRunningFactura2, setIsRunningFactura2] = useState(() => {
    const saved = localStorage.getItem("timeLeftFactura2");
    return saved !== null && parseInt(saved, 10) > 0;
  });

  // Reducir el tiempo cada segundo SOLO si está corriendo y > 0
  useEffect(() => {
    if (!isRunningFactura2 || timeLeftFactura2 <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftFactura2((prev) => {
        const next = prev - 1;
        localStorage.setItem("timeLeftFactura2", String(next)); //  guardar siempre
        if (next <= 0) {
          setIsRunningFactura2(false); // detener si llega a 0
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunningFactura2, timeLeftFactura2]);

  // Formateo mm:ss
  const formatTimeFactura2 = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // start acepta un valor restaurado (número)
  // No arranca si restaurado === 0
  const startFactura2 = (restaurado) => {
    const tiempo =
      typeof restaurado === "number" && !isNaN(restaurado)
        ? restaurado
        : initialTime;

    setTimeLeftFactura2(tiempo);
    localStorage.setItem("timeLeftFactura2", String(tiempo));
    setIsRunningFactura2(tiempo > 0); // arrancar solo si > 0
  };

  const resetFactura2 = () => {
    setTimeLeftFactura2(initialTime);
    localStorage.setItem("timeLeftFactura2", String(initialTime));
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

export function useTemporizadorFactura2() {
  return useContext(TemporizadorFactura2Context);
}
