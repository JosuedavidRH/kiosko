
//CODIGO en produccion 


// C:\Users\user\projects2\myapp2\kiosko_local\src\utils\cerrarSesion.js

export const cerrarSesionGlobal = ({
  auto = false,
  temporizadorPrincipal,
  statusActual,
  userId: userIdParam,     // 👈 aceptar userId desde el caller
  temporizadorFactura1,    // 👈 NUEVO: Factura1
  temporizadorFactura2,    // 👈 NUEVO: Factura2
  temporizadorFactura3,    // 👈 NUEVO: Factura3
} = {}) => {
  const userId = userIdParam || localStorage.getItem("apartmentNumber"); // 👈 prioridad al parámetro
  if (!userId) {
    console.warn("⚠️ cerrarSesionGlobal: No se encontró userId");
    return;
  }

  // Principal
  const temp =
    temporizadorPrincipal !== undefined
      ? temporizadorPrincipal
      : Number.parseInt(localStorage.getItem("timeLeftPrincipal"), 10) || 0;

  // Status
  const status =
    statusActual !== undefined
      ? statusActual
      : Number(localStorage.getItem("clickCount")) || 0;

  // Factura1
  const tempFactura1 =
    temporizadorFactura1 !== undefined
      ? temporizadorFactura1
      : Number(localStorage.getItem("timeLeftFactura1")) || 0;

  // Factura2
  const tempFactura2 =
    temporizadorFactura2 !== undefined
      ? temporizadorFactura2
      : Number(localStorage.getItem("timeLeftFactura2")) || 0;

  // Factura3
  const tempFactura3 =
    temporizadorFactura3 !== undefined
      ? temporizadorFactura3
      : Number(localStorage.getItem("timeLeftFactura3")) || 0;

  // Payload único para todos los datos
  const body = JSON.stringify({
    userId,
    temporizadorPrincipal: temp,
    statusActual: status,
    temporizadorFactura1: tempFactura1,
    temporizadorFactura2: tempFactura2,
    temporizadorFactura3: tempFactura3,
  });

  try {
    if (auto && navigator.sendBeacon) {
      navigator.sendBeacon(
        "https://backend-1uwd.onrender.com/api/realTime/cerrarSesion", // 👈 NUEVO endpoint unificado en backend local
        new Blob([body], { type: "application/json" })
      );

      console.log("📡 Datos enviados con sendBeacon (auto)", {
        temp,
        status,
        tempFactura1,
        tempFactura2,
        tempFactura3,
      });

      localStorage.clear();
      console.log("🧹 LocalStorage limpiado INMEDIATO (auto)");
      return;
    }

    // Manual con fetch
    fetch("https://backend-1uwd.onrender.com/api/realTime/cerrarSesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });

    console.log("📡 Datos enviados con fetch (manual)", {
      temp,
      status,
      tempFactura1,
      tempFactura2,
      tempFactura3,
    });
  } catch (e) {
    console.error("❌ Error cerrando sesión:", e);
  } finally {
    if (!auto) {
      localStorage.clear();
      console.log("🧹 LocalStorage limpiado (manual)");
    }
  }
};