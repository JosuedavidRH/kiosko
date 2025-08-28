
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\components\BotonPrincipal.jsx" solo analizalo no modifiques nada  



import React from "react";
import { useNavigate } from "react-router-dom";
import { guardarStatusActual } from "../utils/guardarStatusActual";
import { useTemporizador } from "../context/TemporizadorContext.jsx"; // Integrar temporizador nuevo

const BotonPrincipal = ({
  clickCount,
  setClickCount,
  isProcessing,
  setIsProcessing,
  apartmentNumber,
  initialTime,
}) => {
  const navigate = useNavigate();
  const { startCountdown, timeLeft } = useTemporizador();

  const handleClick = async () => {
    setIsProcessing(true);

    if (clickCount === 0) {
      try {
        // Generar 3 códigos aleatorios
        const nuevosCodigos = Array.from({ length: 3 }, () =>
          Math.floor(100000 + Math.random() * 900000).toString()
        );

        // Guardar en localStorage
        localStorage.setItem("codigos", JSON.stringify(nuevosCodigos));
        localStorage.setItem("indexActual", "0");

        // Enviar a la BD
        for (const codigo of nuevosCodigos) {
          const payload = {
            numero_apto: apartmentNumber,
            codigo_generado: codigo,
          };
          console.log("📤 Enviando a guardar_numero:", payload);

          await fetch("https://backend-1uwd.onrender.com/api/guardar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        // Determinar tiempo a registrar
        const timeLeftLocal = parseInt(localStorage.getItem("timeLeftPrincipal"), 10);
        const tiempoARegistrar =
          Number.isFinite(timeLeftLocal) && timeLeftLocal > 0
            ? timeLeftLocal
            : initialTime && initialTime > 0
            ? initialTime
            : 60;

        // Guardar tiempo en backend
        try {
          const payloadTemp = {
            userId: apartmentNumber,
            temporizadorPrincipal: tiempoARegistrar,
          };
          console.log("⏱️ Guardando temporizadorPrincipal en backend:", payloadTemp);

          const resp = await fetch("https://backend-1uwd.onrender.com/api/realTime/temporizador", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadTemp),
          });

          const json = await resp.json().catch(() => ({}));
          console.log("🔁 Respuesta temporizador:", resp.status, json);
        } catch (error) {
          console.error("❌ Error al guardar temporizador en backend:", error);
        }

        // Iniciar temporizador en contexto
        startCountdown(tiempoARegistrar);
        console.log("🚀 temporizadorPrincipal activado con:", tiempoARegistrar);

        // Actualizar click count y status
        const nuevoEstado = (clickCount + 1) % 4;
        setClickCount(nuevoEstado);
        guardarStatusActual(nuevoEstado, apartmentNumber);

        navigate("/segunda", { state: { user: apartmentNumber } });
      } catch (error) {
        console.error("❌ Error general al generar y guardar códigos:", error);
      }
    } else {
      // Avanzar click count y guardar status
      const nuevoEstado = (clickCount + 1) % 4;
      setClickCount(nuevoEstado);
      guardarStatusActual(nuevoEstado, apartmentNumber);

      if (clickCount < 3) {
        navigate("/segunda", { state: { user: apartmentNumber } });
      }
    }

    setIsProcessing(false);
  };

  return (
    <button
      disabled={clickCount === 3 || isProcessing}
      onClick={handleClick}
      style={{
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        fontSize: "0.8rem",
        backgroundColor:
          clickCount === 1
            ? "#59ff33"
            : clickCount === 2
            ? "#eea82b"
            : clickCount === 3
            ? "#fd531e"
            : "#ff0",
        color: "#000",
        border: "none",
        cursor: clickCount === 3 || isProcessing ? "not-allowed" : "pointer",
        opacity: clickCount === 3 || isProcessing ? 0.6 : 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {clickCount === 0 && "generar QR"}
      {clickCount === 1 && "TIENES 2 COMPRAS MAS"}
      {clickCount === 2 && "TIENES 1 COMPRA MAS"}
      {clickCount === 3 && "YA NO TIENES MAS COMPRAS"}
    </button>
  );
};

export default BotonPrincipal;
