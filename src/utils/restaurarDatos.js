
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\utils\restaurarDatos.js" solo analizalo no modifiques nada  

export const restaurarDatos = async ({
  apartmentNumber,
  setTimeLeft,
  setFondoRojo,
  setClickCount,
  restart,
  startCountdown, // opcional, si quieres iniciar el timer manualmente

  
  setTimeLeftFactura1,
  setTimeLeftFactura2,
  setTimeLeftFactura3,


  startFactura1,
  startFactura2,   
  startFactura3,  
}) => {
  try {
    const res = await fetch(`http://localhost:4000/api/realtime/${apartmentNumber}`);
    const data = await res.json();

    // 👇 LOG para depuración
    console.log("🔍 Datos recibidos del backend:", data);

    if (!data.success || !data.data) {
      const keysToRemove = [
        "clicked",
        "codigos",
        "factura1Terminada",
        "factura2Terminada",
        "factura3Terminada",
        "indexActual",
        "timeLeftFactura1",
        "timeLeftFactura2",   
        "timeLeftFactura3",   
        "timerStarted",
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      setTimeLeft(43200);
      setFondoRojo(false);
      setClickCount(0);
      localStorage.setItem("clickCount", 0);

      // reset facturas
      if (setTimeLeftFactura1) setTimeLeftFactura1(0);
      if (setTimeLeftFactura2) setTimeLeftFactura2(0);
      if (setTimeLeftFactura3) setTimeLeftFactura3(0);

      if (restart) {
        const exp = new Date();
        exp.setSeconds(exp.getSeconds() + 43200);
        restart(exp, false);
      }

      return;
    }

    const {
      temporizadorPrincipal,
      temporizadorFactura1, 
      temporizadorFactura2, 
      temporizadorFactura3, 
      updated_at,
      statusActual,
    } = data.data;

    const statusNum = statusActual != null ? Number(statusActual) : 0;

    setClickCount(statusNum);
    localStorage.setItem("clickCount", statusNum);

    // ---------- 🕒 PRINCIPAL ----------
    if (statusNum === 0 || temporizadorPrincipal == null) {
      setTimeLeft(43200);
      setFondoRojo(false);

      if (restart) {
        const exp = new Date();
        exp.setSeconds(exp.getSeconds() + 43200);
        restart(exp, false);
      }
    } else {
      const tiempoGuardado = parseInt(temporizadorPrincipal, 10);
      const horaCierre = new Date(updated_at).getTime();
      const tiempoTranscurrido = Math.floor((Date.now() - horaCierre) / 1000);
      const tiempoRestante = tiempoGuardado - tiempoTranscurrido;

      console.log("⏱ temporizadorPrincipal:", temporizadorPrincipal);
      console.log("⏳ tiempoTranscurrido:", tiempoTranscurrido);
      console.log("⏰ tiempoRestante:", tiempoRestante);

      if (!isNaN(tiempoRestante) && tiempoRestante > 0) {
        setTimeLeft(tiempoRestante);
        setFondoRojo(false);

        if (restart) {
          const exp = new Date();
          exp.setSeconds(exp.getSeconds() + tiempoRestante);
          restart(exp, true);
        }
      } else {
        setTimeLeft(0);
        setFondoRojo(statusNum > 0);

        if (restart) {
          const exp = new Date();
          exp.setSeconds(exp.getSeconds() + 0);
          restart(exp, false);
        }
      }
    }

   
// ---------- 🧾 FACTURA 1 ----------
if (setTimeLeftFactura1) {
  if (statusNum === 0 || temporizadorFactura1 == null) {
    // 🟢 Reset a 1200 segundos (inactivo)
    setTimeLeftFactura1(1200);
    localStorage.setItem("timeLeftFactura1", "1200");

    if (typeof startFactura1 === "function") {
      startFactura1(0); // ⛔ no arranca
    }
  } else {
    // 🕒 Reconstruir siempre que statusNum != 0
    const tiempo1 = parseInt(temporizadorFactura1, 10);

    if (!isNaN(tiempo1)) {
      const horaCierre = new Date(updated_at).getTime();
      const tiempoTranscurrido = Math.floor((Date.now() - horaCierre) / 1000);
      const tiempoRestante = tiempo1 - tiempoTranscurrido;

      console.log("⏱ temporizadorFactura1:", temporizadorFactura1);
      console.log("⏳ tiempoTranscurrido:", tiempoTranscurrido);
      console.log("⏰ tiempoRestante (Factura 1):", tiempoRestante);

      if (tiempoRestante > 0) {
        setTimeLeftFactura1(tiempoRestante);
        localStorage.setItem("timeLeftFactura1", String(tiempoRestante));
        if (typeof startFactura1 === "function") {
          startFactura1(tiempoRestante); // 🚀 arranca automático
        }
      } else {
        setTimeLeftFactura1(0);
        localStorage.setItem("timeLeftFactura1", "0");
      }
    }
  }
}

// ---------- 🧾 FACTURA 2 ----------
if (setTimeLeftFactura2) {
  const tiempo2Backend = parseInt(temporizadorFactura2, 10);

  if (!isNaN(tiempo2Backend)) {
    const horaCierre = new Date(updated_at).getTime();
    const tiempoTranscurrido = Math.floor((Date.now() - horaCierre) / 1000);
    let tiempoRestante = tiempo2Backend - tiempoTranscurrido;

    // 🔒 Nueva condición: si statusNum es 0 y aún queda tiempo, no restamos nada
    if (statusNum === 0 && tiempo2Backend > 0) {
      console.log("⏸ Factura 2 en pausa: conservamos el tiempo sin restar transcurrido");
      tiempoRestante = tiempo2Backend; // usamos el valor original del backend
    } else {
      if (tiempoRestante <= 0) tiempoRestante = 0;
    }


    // 🔒 Nueva condición: si statusNum es 0 y aún queda tiempo, no restamos nada
    if (statusNum === 1 && tiempo2Backend > 0) {
      console.log("⏸ Factura 2 en pausa: conservamos el tiempo sin restar transcurrido");
      tiempoRestante = tiempo2Backend; // usamos el valor original del backend
    } else {
      if (tiempoRestante <= 0) tiempoRestante = 0;
    }


    console.log("⏱ temporizadorFactura2:", temporizadorFactura2);
    console.log("⏳ tiempoTranscurrido:", tiempoTranscurrido);
    console.log("⏰ tiempoRestante (Factura 2):", tiempoRestante);

    //  Restaurar si ya llegó a 0 y statusNum está en pausa
    if (tiempoRestante === 0 && statusNum === 0) {
      console.log("⚡ Restaurando temporizadorFactura2 a 1200s sin iniciar conteo");
      tiempoRestante = 1200; // solo restauramos
    }

    // Actualizar estado y localStorage
    setTimeLeftFactura2(tiempoRestante);
    localStorage.setItem("timeLeftFactura2", String(tiempoRestante));
  }
}




// ---------- 🧾 FACTURA 3 ----------
if (setTimeLeftFactura3) {
  const tiempo3Backend = parseInt(temporizadorFactura3, 10);

  if (!isNaN(tiempo3Backend)) {
    const horaCierre = new Date(updated_at).getTime();
    const tiempoTranscurrido = Math.floor((Date.now() - horaCierre) / 1000);
    let tiempoRestante = tiempo3Backend - tiempoTranscurrido;


 // 🔒 Nueva condición: si statusNum es 0 y aún queda tiempo, no restamos nada
    if (statusNum === 0 && tiempo3Backend > 0) {
      console.log("⏸ Factura 3 en pausa: conservamos el tiempo sin restar transcurrido");
      tiempoRestante = tiempo3Backend; // usamos el valor original del backend
    } else {
      if (tiempoRestante <= 0) tiempoRestante = 0;
    }


    // 🔒 Nueva condición: si statusNum es 0 y aún queda tiempo, no restamos nada
    if (statusNum === 1 && tiempo3Backend > 0) {
      console.log("⏸ Factura 3 en pausa: conservamos el tiempo sin restar transcurrido");
      tiempoRestante = tiempo3Backend; // usamos el valor original del backend
    } else {
      if (tiempoRestante <= 0) tiempoRestante = 0;
    }
    
    // 🔒 Nueva condición: si statusNum es 0 y aún queda tiempo, no restamos nada
    if (statusNum === 2 && tiempo3Backend > 0) {
      console.log("⏸ Factura 3 en pausa: conservamos el tiempo sin restar transcurrido");
      tiempoRestante = tiempo3Backend; // usamos el valor original del backend
    } else {
      if (tiempoRestante <= 0) tiempoRestante = 0;
    }
   
    console.log("⏱ temporizadorFactura3:", temporizadorFactura3);
    console.log("⏳ tiempoTranscurrido:", tiempoTranscurrido);
    console.log("⏰ tiempoRestante (Factura 3):", tiempoRestante);

    //  Restaurar el valor si tiempoRestante === 0 y statusNum === 0
    if (tiempoRestante === 0 && statusNum === 0) {
      console.log("⚡ Restaurando temporizadorFactura3 a 1200s sin iniciar conteo");
      tiempoRestante = 1200; // solo restauramos
      // NO llamamos a startFactura3
    }

    // Actualizar estado y localStorage
    setTimeLeftFactura3(tiempoRestante);
    localStorage.setItem("timeLeftFactura3", String(tiempoRestante));
  }
}






  } catch (error) {
    console.error("❌ Error al obtener datos iniciales:", error);
    setTimeLeft(43200);
    setFondoRojo(false);

    if (setTimeLeftFactura1) setTimeLeftFactura1(0); 
    if (setTimeLeftFactura2) setTimeLeftFactura2(0);
    if (setTimeLeftFactura3) setTimeLeftFactura3(0); 

    if (restart) {
      const exp = new Date();
      exp.setSeconds(exp.getSeconds() + 43200);
      restart(exp, false);
    }
  }
};
