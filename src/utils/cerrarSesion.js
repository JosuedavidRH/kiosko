
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\utils\cerrarSesion.js" solo analizalo no modifiques nada  

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

  // Payloads
  const bodyTemp = JSON.stringify({ userId, temporizadorPrincipal: temp });
  const bodyStatus = JSON.stringify({ userId, statusActual: status });
  const bodyFactura1 = JSON.stringify({ userId, temporizadorFactura1: tempFactura1 });
  const bodyFactura2 = JSON.stringify({ userId, temporizadorFactura2: tempFactura2 });
  const bodyFactura3 = JSON.stringify({ userId, temporizadorFactura3: tempFactura3 });

  try {
    if (auto && navigator.sendBeacon) {
      navigator.sendBeacon(
        "",
        new Blob([bodyTemp], { type: "application/json" })
      );
      navigator.sendBeacon(
        "https://backend-1uwd.onrender.com/api/realTime/statusActual",
        new Blob([bodyStatus], { type: "application/json" })
      );
      navigator.sendBeacon(
        "https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura1",
        new Blob([bodyFactura1], { type: "application/json" })
      );
      navigator.sendBeacon(
        " https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura2",
        new Blob([bodyFactura2], { type: "application/json" })
      );
      navigator.sendBeacon(
        "https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura3",
        new Blob([bodyFactura3], { type: "application/json" })
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

    fetch("https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyFactura1, 
      keepalive: true,
    });

    fetch(" https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyFactura2,
      keepalive: true,
    });

    fetch("https://backend-1uwd.onrender.com/api/realTime/temporizadorFactura3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyFactura3,
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

