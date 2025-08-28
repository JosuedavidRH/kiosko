
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\utils\cerrarSesion.js" solo analizalo no modifiques nada  



export const cerrarSesionGlobal = ({
  auto = false,
  temporizadorPrincipal,
  statusActual,
  userId: userIdParam,   // 👈 aceptar userId desde el caller
} = {}) => {
  const userId = userIdParam || localStorage.getItem("apartmentNumber"); // 👈 prioridad al parámetro
  if (!userId) {
    console.warn("⚠️ cerrarSesionGlobal: No se encontró userId");
    return;
  }

  const temp =
    temporizadorPrincipal !== undefined
      ? temporizadorPrincipal
      : Number.parseInt(localStorage.getItem("timeLeftPrincipal"), 10) || 0;

  const status =
    statusActual !== undefined
      ? statusActual
      : Number(localStorage.getItem("clickCount")) || 0;

  const bodyTemp = JSON.stringify({ userId, temporizadorPrincipal: temp });
  const bodyStatus = JSON.stringify({ userId, statusActual: status });

  try {
    if (auto && navigator.sendBeacon) {
      navigator.sendBeacon(
        "https://backend-1uwd.onrender.com/api/realTime/temporizador",
        new Blob([bodyTemp], { type: "application/json" })
      );
      navigator.sendBeacon(
        "https://backend-1uwd.onrender.com/api/realTime/statusActual",
        new Blob([bodyStatus], { type: "application/json" })
      );
      console.log("📡 Datos enviados con sendBeacon (auto)", { temp, status });
      localStorage.clear();
      console.log("🧹 LocalStorage limpiado INMEDIATO (auto)");
      return;
    }

    fetch("https://backend-1uwd.onrender.com/api/realTime/temporizador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyTemp,
      keepalive: true,
    });

    fetch("https://backend-1uwd.onrender.com/api/realTime/statusActual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyStatus,
      keepalive: true,
    });

    console.log("📡 Datos enviados con fetch (manual)", { temp, status });
  } catch (e) {
    console.error("❌ Error cerrando sesión:", e);
  } finally {
    if (!auto) {
      localStorage.clear();
      console.log("🧹 LocalStorage limpiado (manual)");
    }
  }
};



