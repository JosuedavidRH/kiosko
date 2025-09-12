//CODIGO en produccion 


import React, { useEffect } from "react";
import { useTemporizadorFactura3 } from "./context/TemporizadorFactura3Context";

function TemporizadorFactura3({ onFinish }) {
  const {
    timeLeftFactura3,
    formatTimeFactura3,
    isRunningFactura3,
    startFactura3,
  } = useTemporizadorFactura3();

  // 🚀 Solo arranca si hay tiempo > 0 y no está corriendo
  useEffect(() => {
    if (!isRunningFactura3 && timeLeftFactura3 > 0) {
      startFactura3(timeLeftFactura3); 
    }
  }, [isRunningFactura3, timeLeftFactura3, startFactura3]);

  // Detecta cuando termina o ya está en 0 al montar
  useEffect(() => {
    if (timeLeftFactura3 <= 0) {
      if (onFinish) onFinish();
    }
  }, [timeLeftFactura3, onFinish]);

  return (
    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      {formatTimeFactura3(timeLeftFactura3)}
    </span>
  );
}

export default TemporizadorFactura3;
