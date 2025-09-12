//CODIGO en produccion 


import React, { createContext, useContext, useEffect, useState } from "react";

const TemporizadorFactura3Context = createContext();

export function TemporizadorFactura3Provider({ children, initialTime = 1200 }) { // ⬅️ 20 minutos = 1200s
  // leer localStorage incluso si es "0"
  const [timeLeftFactura3, setTimeLeftFactura3] = useState(() => {
    const saved = localStorage.getItem("timeLeftFactura3");
    return saved !== null ? parseInt(saved, 10) : initialTime;
  });

  //  isRunning inicial si había valor > 0 guardado
  const [isRunningFactura3, setIsRunningFactura3] = useState(() => {
    const saved = localStorage.getItem("timeLeftFactura3");
    return saved !== null && parseInt(saved, 10) > 0;
  });

  // Reducir el tiempo cada segundo SOLO si está corriendo y > 0
  useEffect(() => {
    if (!isRunningFactura3 || timeLeftFactura3 <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftFactura3((prev) => {
        const next = prev - 1;
        localStorage.setItem("timeLeftFactura3", String(next)); // guardar siempre
        if (next <= 0) {
          setIsRunningFactura3(false); // detener si llega a 0
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunningFactura3, timeLeftFactura3]);

  // Formateo mm:ss
  const formatTimeFactura3 = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // start acepta un valor restaurado (número). No arranca si restaurado === 0
  const startFactura3 = (restaurado) => {
    const tiempo =
      typeof restaurado === "number" && !isNaN(restaurado)
        ? restaurado
        : initialTime;

    setTimeLeftFactura3(tiempo);
    localStorage.setItem("timeLeftFactura3", String(tiempo)); // guardar
    setIsRunningFactura3(tiempo > 0); // arrancar solo si > 0
  };

  const resetFactura3 = () => {
    setTimeLeftFactura3(initialTime);
    localStorage.setItem("timeLeftFactura3", String(initialTime));
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
