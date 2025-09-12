
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\context\TemporizadorContext.jsx" solo analizalo no modifiques nada  

import React, { createContext, useContext, useEffect, useState, useRef } from "react";

import { cerrarSesionGlobal } from "../utils/cerrarSesion";

export const TemporizadorContext = createContext();

export function TemporizadorProvider({
  children,
  apartmentNumber,
  initialTime = 43200,
  timeLeft = 43200,
  fondoRojo: fondoRojoProp = false,
  statusActual = 0,
}) {
  const [fondoRojo, setFondoRojo] = useState(!!fondoRojoProp);
  const [timeLeftState, setTimeLeftState] = useState(timeLeft);
  const [isRunning, setIsRunning] = useState(false);

  // 🔹 Arranca el contador si hay tiempo
  useEffect(() => {
    if (timeLeftState > 0) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setFondoRojo(true);
    }
  }, [timeLeftState]);

  // 🔹 Interval que descuenta cada segundo
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeftState((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setFondoRojo(true);

          if (apartmentNumber) {
            cerrarSesionGlobal({
              auto: false,
              temporizadorPrincipal: 0,
              userId: apartmentNumber,
              statusActual,
            });
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, apartmentNumber, statusActual]);


 // 👇 Ref para siempre tener el último valor sin re-render
  const timeLeftRef = useRef(timeLeftState);
  useEffect(() => {
    timeLeftRef.current = timeLeftState;
  }, [timeLeftState]);

 



  // Helpers
  const startCountdown = (secondsToRun = initialTime) => {
    setTimeLeftState(secondsToRun);
    setFondoRojo(false);
    setIsRunning(true);

    if (apartmentNumber) {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: secondsToRun,
        userId: apartmentNumber,
        statusActual,
      });
    }
  };

  const stopAndPersist = () => {
    setIsRunning(false);
    if (apartmentNumber) {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: timeLeftState,
        userId: apartmentNumber,
        statusActual,
      });
    }
  };

  //  Formato HH:mm:ss
  const formatTimeLeft = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  return (
    <TemporizadorContext.Provider
      value={{
        timeLeft: timeLeftState,
        setTimeLeft: setTimeLeftState,
        isRunning,
        startCountdown,
        stopAndPersist,
        fondoRojo,
        setFondoRojo,
        formatTimeLeft,
      }}
    >
      {children}
    </TemporizadorContext.Provider>
  );
}

export const useTemporizador = () => {
  const context = useContext(TemporizadorContext);
  if (!context) throw new Error("useTemporizador debe usarse dentro de un TemporizadorProvider");
  return context;
};
