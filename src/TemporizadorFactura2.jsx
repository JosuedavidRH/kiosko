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

  // 🚀 Arranca automáticamente cuando el componente se monta
  useEffect(() => {
    if (!isRunningFactura2) {
      startFactura2();
    }
  }, [isRunningFactura2, startFactura2]);

  // Detecta cuando termina
  useEffect(() => {
    if (timeLeftFactura2 <= 0 && isRunningFactura2) {
      if (onFinish) onFinish();
    }
  }, [timeLeftFactura2, isRunningFactura2, onFinish]);

  return (
    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      {formatTimeFactura2(timeLeftFactura2)}
    </span>
  );
}

export default TemporizadorFactura2;
