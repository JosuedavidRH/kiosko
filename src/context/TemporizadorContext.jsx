
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\context\TemporizadorContext.jsx" solo analizalo no modifiques nada  


import React, { createContext, useContext, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { cerrarSesionGlobal } from "../utils/cerrarSesion";

export const TemporizadorContext = createContext();

export function TemporizadorProvider({
  children,
  apartmentNumber,
  initialTime = 60,
  timeLeft = 60,
  timerStarted = false,
  fondoRojo: fondoRojoProp = false,
  statusActual = 0,
}) {
  const [fondoRojo, setFondoRojo] = useState(!!fondoRojoProp);
  const [timeLeftState, setTimeLeftState] = useState(timeLeft);

  // Crear expiry inicial
  const initialExpiry = new Date();
  initialExpiry.setSeconds(initialExpiry.getSeconds() + Math.max(timeLeftState, 1));

  const { seconds, minutes, restart, pause, resume, isRunning } = useTimer({
    expiryTimestamp: initialExpiry,
    autoStart: false,
    onExpire: () => {
      setFondoRojo(true);
      if (apartmentNumber) {
        cerrarSesionGlobal({
          auto: false,
          temporizadorPrincipal: 0,
          userId: apartmentNumber,
          statusActual,
        });
      }
    },
  });

  // Bootstrap: arranca automáticamente si queda tiempo
  useEffect(() => {
    const secs = Number(timeLeftState) || 0;
    setFondoRojo(!!fondoRojoProp);

    const exp = new Date();
    exp.setSeconds(exp.getSeconds() + Math.max(secs, 0));

    if (secs > 0) restart(exp, true);
    else {
      restart(exp, false);
      setFondoRojo(true);
    }
  }, [timeLeftState, fondoRojoProp, restart]);

  // Persistir automáticamente cada 15s mientras el timer corre
  useEffect(() => {
    if (!apartmentNumber || !isRunning) return;

    const interval = setInterval(() => {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: minutes * 60 + seconds,
        userId: apartmentNumber,
        statusActual,
      });
    }, 15000); // cada 15 segundos

    return () => clearInterval(interval);
  }, [apartmentNumber, isRunning, minutes, seconds, statusActual]);

  

  // Helpers
  const startCountdown = (secondsToRun = 60) => {
    const exp = new Date();
    exp.setSeconds(exp.getSeconds() + Math.max(secondsToRun, 1));
    setFondoRojo(false);
    restart(exp, true);
    setTimeLeftState(secondsToRun);

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
    pause();
    if (apartmentNumber) {
      cerrarSesionGlobal({
        auto: false,
        temporizadorPrincipal: minutes * 60 + seconds,
        userId: apartmentNumber,
        statusActual,
      });
    }
  };

  return (
    <TemporizadorContext.Provider
      value={{
        minutes,
        seconds,
        timeLeft: minutes * 60 + seconds,
        setTimeLeft: setTimeLeftState,
        isRunning,
        pause,
        resume,
        restart,
        startCountdown,
        stopAndPersist,
        fondoRojo,
        setFondoRojo,
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
