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

  // 🚀 Arranca automáticamente cuando el componente se monta
  useEffect(() => {
    if (!isRunningFactura3) {
      startFactura3();
    }
  }, [isRunningFactura3, startFactura3]);

  // Detecta cuando termina
  useEffect(() => {
    if (timeLeftFactura3 <= 0 && isRunningFactura3) {
      if (onFinish) onFinish();
    }
  }, [timeLeftFactura3, isRunningFactura3, onFinish]);

  return (
    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      {formatTimeFactura3(timeLeftFactura3)}
    </span>
  );
}

export default TemporizadorFactura3;
