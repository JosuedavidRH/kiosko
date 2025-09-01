
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\utils\restaurarDatos.js" solo analizalo no modifiques nada  


export const restaurarDatos = async ({
  apartmentNumber,
  setTimeLeft,
  setFondoRojo,
  setClickCount,
  restart,
  startCountdown, // opcional, si quieres iniciar el timer manualmente
}) => {
  try {
    const res = await fetch(`https://backend-1uwd.onrender.com/api/realTime/${apartmentNumber}`);
    const data = await res.json();

    if (!data.success || !data.data) {
      const keysToRemove = [
        'clicked','codigos','factura1Terminada','factura2Terminada','factura3Terminada',
        'indexActual','timeLeftFactura1','timerStarted'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      setTimeLeft(43200);
      setFondoRojo(false);
      setClickCount(0);
      localStorage.setItem('clickCount', 0);

      if (restart) {
        const exp = new Date();
        exp.setSeconds(exp.getSeconds() + 43200);
        restart(exp, false);
      }

      return;
    }

    const { temporizadorPrincipal, updated_at, statusActual } = data.data;
    const statusNum = statusActual != null ? Number(statusActual) : 0;

    setClickCount(statusNum);
    localStorage.setItem('clickCount', statusNum);

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
  } catch (error) {
    console.error("❌ Error al obtener datos iniciales:", error);
    setTimeLeft(43200);
    setFondoRojo(false);

    if (restart) {
      const exp = new Date();
      exp.setSeconds(exp.getSeconds() + 43200);
      restart(exp, false);
    }
  }
};
