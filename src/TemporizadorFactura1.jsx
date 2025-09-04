//CODIGO en produccion 




import React, { useEffect } from "react";
import { useTemporizadorFactura1 } from "./context/TemporizadorFactura1Context";

function TemporizadorFactura1({ onFinish }) {
  const { timeLeftFactura1, formatTimeFactura1 } = useTemporizadorFactura1();

  // Avisar cuando termine
  useEffect(() => {
    if (timeLeftFactura1 <= 0 && onFinish) {
      onFinish();
    }
  }, [timeLeftFactura1, onFinish]);

  return (
    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      {formatTimeFactura1(timeLeftFactura1)}
    </span>
  );
}

export default TemporizadorFactura1;
