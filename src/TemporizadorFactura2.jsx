//CODIGO en produccion 

import React, { useEffect } from "react";
import { useTemporizadorFactura2 } from "./context/TemporizadorFactura2Context";

function TemporizadorFactura2({ onFinish }) {
  const {
    timeLeftFactura2,
    formatTimeFactura2,
    isRunningFactura2,
    startFactura2,
  } = useTemporizadorFactura2();

  // 🚀 Solo arranca si hay tiempo > 0
  useEffect(() => {
    if (!isRunningFactura2 && timeLeftFactura2 > 0) {
      startFactura2(timeLeftFactura2);
    }
  }, [isRunningFactura2, timeLeftFactura2, startFactura2]);

  // Detecta cuando termina o ya está en 0 al montar
  useEffect(() => {
    if (timeLeftFactura2 <= 0) {
      if (onFinish) onFinish();
    }
  }, [timeLeftFactura2, onFinish]);

  return (
    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      {formatTimeFactura2(timeLeftFactura2)}
    </span>
  );
}

export default TemporizadorFactura2;
