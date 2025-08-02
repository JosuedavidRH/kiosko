//CODIGO en produccion 

import React, { useState,useEffect  } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import TemporizadorPrincipal from './TemporizadorPrincipal.jsx';
import TemporizadorFactura1 from './TemporizadorFactura1';
import TemporizadorFactura2 from './TemporizadorFactura2';
import TemporizadorFactura3 from './TemporizadorFactura3';
import SegundaPagina from './SegundaPagina.jsx';
import { FaClock } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [apartmentNumber, setApartmentNumber] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const location = useLocation();

  // Estados compartidos y persistentes
  const [clickCount, setClickCount] = useState(() => {
    const saved = localStorage.getItem('clickCount');
    return saved !== null ? Number(saved) : 0;
  });

  const [timerStarted, setTimerStarted] = useState(() => {
    return localStorage.getItem('timerStarted') === 'true';
  });

  const [clicked, setClicked] = useState(() => {
    return localStorage.getItem('clicked') === 'true';
  });

  const [factura1Terminada, setFactura1Terminada] = useState(() => {
  return localStorage.getItem('factura1Terminada') === 'true';
});

const [factura2Terminada, setFactura2Terminada] = useState(() => {
  return localStorage.getItem('factura2Terminada') === 'true';
});

const [factura3Terminada, setFactura3Terminada] = useState(() => {
  return localStorage.getItem('factura3Terminada') === 'true';
});



  // Sincroniza con localStorage
  
  useEffect(() => {
  localStorage.setItem('clickCount', clickCount);
}, [clickCount]);


  useEffect(() => {
    localStorage.setItem('timerStarted', timerStarted);
  }, [timerStarted]);

  useEffect(() => {
    localStorage.setItem('clicked', clicked);
  }, [clicked]);


  useEffect(() => {
  localStorage.setItem('factura1Terminada', factura1Terminada);
}, [factura1Terminada]);

useEffect(() => {
  localStorage.setItem('factura2Terminada', factura2Terminada);
}, [factura2Terminada]);

useEffect(() => {
  localStorage.setItem('factura3Terminada', factura3Terminada);
}, [factura3Terminada]);




  return user ? (
    <AppContent 
  user={user}
  apartmentNumber={apartmentNumber}
  clicked={clicked}
  setClicked={setClicked}
  clickCount={clickCount}
  setClickCount={setClickCount}
  timerStarted={timerStarted}
  setTimerStarted={setTimerStarted}
  factura1Terminada={factura1Terminada}
  setFactura1Terminada={setFactura1Terminada}
  factura2Terminada={factura2Terminada}
  setFactura2Terminada={setFactura2Terminada}
  factura3Terminada={factura3Terminada}
  setFactura3Terminada={setFactura3Terminada}
  isProcessing={isProcessing}          // ✅
  setIsProcessing={setIsProcessing}    // ✅
/>
  ) : isRegistering ? (
    <Register 
  onRegister={({ username, apartmentNumber }) => {
    setUser(username);
    setApartmentNumber(apartmentNumber);
  }}
  goToLogin={() => setIsRegistering(false)} 
/>

  ) : (
    <Login
  onLogin={({ username, apartmentNumber }) => {
    setUser(username);
    setApartmentNumber(apartmentNumber);
  }}
  goToRegister={() => setIsRegistering(true)}
/>


  );
}

function AppContent({

 user, 
  apartmentNumber,
  clicked, setClicked, 
  clickCount, setClickCount, 
  timerStarted, setTimerStarted,
  factura1Terminada, setFactura1Terminada,
  factura2Terminada, setFactura2Terminada,
  factura3Terminada, setFactura3Terminada,
   isProcessing, setIsProcessing   
 }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [initialTime, setInitialTime] = useState(12 * 60 * 60); 
  const [temporizadorListo, setTemporizadorListo] = useState(false); // 👈 nueva bandera

useEffect(() => {
  const fetchTemporizador = async () => {
    try {
      const res = await fetch(`https://backend-1uwd.onrender.com/api/realTime/${apartmentNumber}`);
      const data = await res.json();

      if (data.success && data.data && data.data.temporizadorPrincipal !== null) {
        const tiempoGuardado = parseInt(data.data.temporizadorPrincipal, 10);
        const horaCierre = new Date(data.data.updated_at).getTime();
        const horaActual = Date.now();
        const tiempoTranscurrido = Math.floor((horaActual - horaCierre) / 1000);
        const tiempoRestante = tiempoGuardado - tiempoTranscurrido;

        if (!isNaN(tiempoRestante) && tiempoRestante > 0) {
          console.log("⏳ Restaurando con tiempo restante:", tiempoRestante);
          localStorage.setItem("Restaurando temporizador", tiempoRestante.toString());
          setInitialTime(tiempoRestante);
          setTimerStarted(true);
          setTemporizadorListo(true);
          setTemporizadorActivo(true);
          return;
        }
      }

      // ⚠️ Usuario sin datos válidos: limpiar todo
      console.log("🆕 Usuario nuevo o sin datos válidos. Reiniciando temporizador.");
      localStorage.clear();
      setInitialTime(12 * 60 * 60);     // 12 horas por defecto
      setTimerStarted(false);           // empieza en pausa
      setTemporizadorListo(true);       // permitir mostrar el componente
      setTemporizadorActivo(false);
    } catch (error) {
      console.error("❌ Error al obtener temporizador:", error);
      setInitialTime(12 * 60 * 60);
      setTimerStarted(false);
      setTemporizadorListo(true);
      setTemporizadorActivo(false);
    }
  };

  if (apartmentNumber) {
    fetchTemporizador();
  }
}, [apartmentNumber]);

useEffect(() => {
  if (clickCount === 1 && !timerStarted) {
    console.log('✅ Activando temporizador por botón principal...');
    setTimerStarted(true);
  }
}, [clickCount, timerStarted]);




 
  return (
    <Routes>

    <Route path="/segunda" element={<SegundaPagina user={{ username: user, apartmentNumber }} />} />

      <Route
        path="/"
        element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100vh',
            backgroundColor: '#282c34',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: '0' }}>
              Hola, {user}! Apto: {apartmentNumber}
            </h1>
        {temporizadorListo && (
  <TemporizadorPrincipal
    start={timerStarted}
    initialTime={initialTime}
    onGuardarTiempo={(tiempoRestante) => {
      localStorage.setItem('timeLeftPrincipal', tiempoRestante.toString());
    }}
  />
)}





{/* Aquí puedes volver a poner tus temporizadores,botones, headers, etc si quieres */}


{/* header contenedor del boton cerrar */}

<header style={{
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(485px)',  // sube el container
    marginLeft: '-240px'            // mueve todo el header a la derecha
  }}>
    <div style={{
      backgroundColor: 'transparent',
      width: '110px',
      height: '60px',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>

{timerStarted && (
  <>
    <button
  onClick={async () => {
    const timeLeft = localStorage.getItem('timeLeftPrincipal');
    if (timeLeft) {
      const parsedTime = parseInt(timeLeft, 10);

      try {
        const res = await fetch('https://backend-1uwd.onrender.com/api/realTime/temporizador', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: apartmentNumber,
            temporizadorPrincipal: parsedTime,
          }),
        });

        const data = await res.json();
        if (data.success) {
          alert('⏱ Tiempo guardado con éxito');
        } else {
          console.error('❌ Error en respuesta:', data.message);
        }
      } catch (error) {
        console.error('❌ Error al conectar con realTime.js:', error);
      }
    } else {
      console.warn('⏱ No hay tiempo guardado en localStorage');
    }

    // 🔥 Cerrar sesión
    localStorage.clear();
    window.location.reload();
  }}
  style={{
    alignSelf: 'center',
    marginTop: '35px',
    marginLeft: '-40px',
    padding: '6px 6px',
    fontSize: '0.9rem',
    borderRadius: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  }}
>
  Cerrar 🔒
</button>

  </>
)}

</div>
  </header>



          
          
{/* header con contenedor del icono */}
{clickCount >= 1 && (
  <header style={{
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(-60px)',  // sube el container
    marginLeft: '160px'            // mueve todo el header a la derecha
  }}>
    <div style={{
      backgroundColor: 'transparent',
      width: '170px',
      height: '60px',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Icono con animación */}
      <FaClock style={{
        fontSize: '2.8rem',
        color: 'white',
        animation: 'pulse 1s infinite',
        marginBottom: '5px'
      }} />
      
      <span style={{ fontSize: '0.7rem', color: 'white' }}>
         ESPERA TUS FACTURAS
      </span>
    </div>
  </header>
)}
  
     {/* header 0 con contenedor del botón */}
{clickCount >= 1 && (
  <header style={{
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(-80px)',  // sube el container
    marginLeft: '-190px'            // mueve todo el header a la derecha
  }}>
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.2)',
      width: '170px',
      height: '200px',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',       // apila imagen y texto verticalmente
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img 
        src="/compras.png" 
        alt="Compras"
        style={{ width: '80px', height: '80px', marginBottom: '5px' }}
      />
      <span style={{ fontSize: '0.8rem', color: 'white' }}>
       HAY <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{clickCount}</span>  FACTURAS por valor de ;
      </span>
    </div>
  </header>
)}

{/* header 1 con contenedor del botón */}

{clickCount >= 1 && (
  <header style={{
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(-250px)',
    marginLeft: '160px'
  }}>
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.2)',
      width: '200px',
      height: '120px',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {factura1Terminada ? (
  <div style={{ textAlign: 'center' }}>
    <div style={{ 
      fontSize: '0.9rem',           // antes era 0.7rem, ahora más grande
      marginBottom: '8px',       // un poco más de espacio abajo
      fontWeight: 'bold'         // opcional, para que se vea más destacado
    }}>
      lista tu factura 1 valor;
    </div>
    <button style={{
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 16px',      // más grande
      cursor: 'pointer',
      fontSize: '1.3rem'         // antes era 0.7rem
    }}>
      pagar
    </button>
  </div>
      ) : (
        <button
          onClick={() => setClicked(!clicked)}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            fontSize: '0.6rem',
            backgroundColor:'#ff0',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <TemporizadorFactura1 onFinish={() => setFactura1Terminada(true)} />
        </button>
      )}
    </div>
  </header>
)}


{/* header 2 con contenedor del botón */}

{clickCount >= 2 && (
  <header style={{
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(-240px)',
    marginLeft: '160px'
  }}>
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.2)',
      width: '200px',
      height: '120px',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {factura2Terminada ? (
  <div style={{ textAlign: 'center' }}>
    <div style={{ 
      fontSize: '0.9rem',           // antes era 0.7rem, ahora más grande
      marginBottom: '8px',       // un poco más de espacio abajo
      fontWeight: 'bold'         // opcional, para que se vea más destacado
    }}>
      lista tu factura 2 valor;
    </div>
    <button style={{
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 16px',      // más grande
      cursor: 'pointer',
      fontSize: '1.3rem'         // antes era 0.7rem
    }}>
      pagar
    </button>
  </div>
      ) : (
        <button
          onClick={() => setClicked(!clicked)}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            fontSize: '0.6rem',
            backgroundColor:'#ff0',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <TemporizadorFactura2 onFinish={() => setFactura2Terminada(true)} />
        </button>
      )}
    </div>
  </header>
)}


{/* header 3 con contenedor del botón */}


{clickCount >= 3 && (
  <header style={{
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(-230px)',
    marginLeft: '160px'
  }}>
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.2)',
      width: '200px',
      height: '120px',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {factura3Terminada ? (
  <div style={{ textAlign: 'center' }}>
    <div style={{ 
      fontSize: '0.9rem',           // antes era 0.7rem, ahora más grande
      marginBottom: '8px',       // un poco más de espacio abajo
      fontWeight: 'bold'         // opcional, para que se vea más destacado
    }}>
      lista tu factura 3 valor;
    </div>
    <button style={{
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 16px',      // más grande
      cursor: 'pointer',
      fontSize: '1.3rem'         // antes era 0.7rem
    }}>
      pagar
    </button>
  </div>
      ) : (
        <button
          onClick={() => setClicked(!clicked)}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            fontSize: '0.6rem',
            backgroundColor:'#ff0',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <TemporizadorFactura3 onFinish={() => setFactura3Terminada(true)} />
        </button>
      )}
    </div>
  </header>
)}

<footer style={{
  display: 'flex',
  justifyContent: 'center',
  transform: 'translateY(-210px)'
}}>
  <div style={{
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: '200px',
    height: '120px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <button
      disabled={clickCount === 3 || isProcessing}
      onClick={async () => {
        setIsProcessing(true);

        if (clickCount === 0) {
          try {
            // ✅ Generar 3 códigos aleatorios
            const nuevosCodigos = Array.from({ length: 3 }, () =>
              Math.floor(100000 + Math.random() * 900000).toString()
            );

            // ✅ Guardar en localStorage
            localStorage.setItem('codigos', JSON.stringify(nuevosCodigos));
            localStorage.setItem('indexActual', '0');

            // ✅ Enviar a la BD
            for (const codigo of nuevosCodigos) {
              const payload = {
                numero_apto: apartmentNumber,
                codigo_generado: codigo
              };

              console.log('📤 Enviando a guardar_numero:', payload);

              await fetch('https://backend-1uwd.onrender.com/api/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
            }

            // ✅ Avanzar click count y redirigir
            setClickCount(prev => (prev + 1) % 4);
            navigate('/segunda');

          } catch (error) {
            console.error('❌ Error general al generar y guardar códigos:', error);
          }

        } else if (clickCount === 1 || clickCount === 2) {
          setClickCount(prev => (prev + 1) % 4);
          navigate('/segunda');
        } else {
          setClickCount(prev => (prev + 1) % 4);
        }

        setIsProcessing(false);
      }}
      style={{
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        fontSize: '0.8rem',
        backgroundColor:
          clickCount === 1 ? '#59ff33' :
          clickCount === 2 ? '#eea82b' :
          clickCount === 3 ? '#fd531e' :
          '#ff0',
        color: '#000',
        border: 'none',
        cursor: clickCount === 3 || isProcessing ? 'not-allowed' : 'pointer',
        opacity: clickCount === 3 || isProcessing ? 0.6 : 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {clickCount === 0 && 'generar QR'}
      {clickCount === 1 && 'TIENES 2 COMPRAS MAS'}
      {clickCount === 2 && 'TIENES 1 COMPRA MAS'}
      {clickCount === 3 && 'YA NO TIENES MAS COMPRAS'}
    </button>
  </div>
</footer>



          </div>
        }
      />
     <Route path="/segunda" element={<SegundaPagina user={user} />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
