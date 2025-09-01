
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\components\BotonPrincipal.jsx" solo analizalo no modifiques nada  


import React from "react"; 
import { useNavigate } from "react-router-dom";
import { guardarStatusActual } from "../utils/guardarStatusActual";
import { useTemporizador } from "../context/TemporizadorContext.jsx";

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

    // índice que DEBEMOS mostrar en /segunda (antes de incrementar clickCount)
    const indexToShow = clickCount;

    if (clickCount === 0) {
      try {
        // Consultar backend
        const resp = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`);
        const data = await resp.json();
        const hayCodigos = data.success && data.data && data.data.length > 0;

        if (hayCodigos) {
          console.log("⚠️ Ya existen códigos en BD, no se generan nuevos.");
          const codigosBD = data.data.map(item => item.codigo_qr);

          // Guardar provisionalmente en localStorage (fuente: backend)
          localStorage.setItem("codigos", JSON.stringify(codigosBD));
          // Guardamos el índice correcto a mostrar (no forzamos 0 si ya existe)
          localStorage.setItem("indexActual", String(indexToShow));

          // Avanzar estado
          const nuevoEstado = (clickCount + 1) % 4;
          setClickCount(nuevoEstado);
          guardarStatusActual(nuevoEstado, apartmentNumber);

          // Pasamos también los códigos y el índice en el state para mayor consistencia
          navigate("/segunda", { state: { user: apartmentNumber, codigos: codigosBD, indexActual: indexToShow } });
        } else {
          console.log("✅ No hay códigos en BD, generando nuevos...");

          const nuevosCodigos = Array.from({ length: 3 }, () =>
            Math.floor(100000 + Math.random() * 900000).toString()
          );

          // Guardar provisionalmente (fuente: generador)
          localStorage.setItem("codigos", JSON.stringify(nuevosCodigos));
          localStorage.setItem("indexActual", String(indexToShow)); // importante: index correcto

          // Enviar a la BD (esperamos cada POST)
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

          // Guardar temporizador en backend si aplica
          const timeLeftLocal = parseInt(localStorage.getItem("timeLeftPrincipal"), 10);
          const tiempoARegistrar =
            Number.isFinite(timeLeftLocal) && timeLeftLocal > 0
              ? timeLeftLocal
              : initialTime && initialTime > 0
              ? initialTime
              : 43200;

          try {
            const payloadTemp = {
              userId: apartmentNumber,
              temporizadorPrincipal: tiempoARegistrar,
            };
            await fetch("https://backend-1uwd.onrender.com/api/realTime/temporizador", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadTemp),
            });
          } catch (error) {
            console.error("❌ Error al guardar temporizador en backend:", error);
          }

          startCountdown(tiempoARegistrar);

          const nuevoEstado = (clickCount + 1) % 4;
          setClickCount(nuevoEstado);
          guardarStatusActual(nuevoEstado, apartmentNumber);

          // Navegamos pasando los códigos generados y el índice
          navigate("/segunda", { state: { user: apartmentNumber, codigos: nuevosCodigos, indexActual: indexToShow } });
        }
      } catch (error) {
        console.error("❌ Error general en handleClick:", error);
      }
    } else if (clickCount === 1 || clickCount === 2) {
      try {
        // Recuperar SIEMPRE desde backend
        const resp = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${apartmentNumber}`);
        const data = await resp.json();

        if (data.success && data.data && data.data.length > 0) {
          console.log("📥 Recuperando códigos desde backend:", data.data);
          const codigosBD = data.data.map(item => item.codigo_qr);

          // Guardamos en localStorage y aseguramos indexActual = indexToShow
          localStorage.setItem("codigos", JSON.stringify(codigosBD));
          localStorage.setItem("indexActual", String(indexToShow));

          // Avanzar estado
          const nuevoEstado = (clickCount + 1) % 4;
          setClickCount(nuevoEstado);
          guardarStatusActual(nuevoEstado, apartmentNumber);

          // Navegamos pasando el array y el índice para que SegundaPagina lo muestre exactamente
          navigate("/segunda", { state: { user: apartmentNumber, codigos: codigosBD, indexActual: indexToShow } });
        } else {
          console.warn("⚠️ No se encontraron códigos en backend para este usuario.");
        }
      } catch (error) {
        console.error("❌ Error recuperando códigos en clickCount 1 o 2:", error);
      }
    } else {
      // clickCount === 3 --> no más compras
      const nuevoEstado = (clickCount + 1) % 4;
      setClickCount(nuevoEstado);
      guardarStatusActual(nuevoEstado, apartmentNumber);
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
