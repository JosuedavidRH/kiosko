
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\App.jsx"  solo analizalo no modifiques nada  

import React, { useState, useEffect, useRef } from 'react';

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';

import TemporizadorFactura1 from './TemporizadorFactura1';
import TemporizadorFactura2 from './TemporizadorFactura2';
import TemporizadorFactura3 from './TemporizadorFactura3';
import SegundaPagina from './SegundaPagina.jsx';
import { FaClock } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { guardarStatusActual } from "./utils/guardarStatusActual";
import { cerrarSesionGlobal } from "./utils/cerrarSesion";
import { restaurarDatos } from "./utils/restaurarDatos";
import ContenedoresPaginaPrincipal from "./components/contenedoresPaginaPrincipal";
import BotonPrincipal from "./components/BotonPrincipal";
import { useTemporizador } from "./context/TemporizadorContext.jsx";
import { TemporizadorProvider } from "./context/TemporizadorContext.jsx"; 
import { TemporizadorFactura1Provider } from "./context/TemporizadorFactura1Context";
import { TemporizadorFactura2Provider } from "./context/TemporizadorFactura2Context"; 
import { TemporizadorFactura3Provider } from "./context/TemporizadorFactura3Context";
import { useTemporizadorFactura1 } from './context/TemporizadorFactura1Context';
import { useTemporizadorFactura2 } from './context/TemporizadorFactura2Context';
import { useTemporizadorFactura3 } from './context/TemporizadorFactura3Context';


function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [apartmentNumber, setApartmentNumber] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
 
  const location = useLocation();

  const { timeLeft, formatTimeLeft } = useTemporizador();

 

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

     <TemporizadorProvider
      apartmentNumber={apartmentNumber}
      initialTime={60} // o el valor que quieras
      timeLeft={Number(localStorage.getItem("timeLeftPrincipal") || 60)}
      timerStarted={timerStarted}
      statusActual={clickCount}
    >
     
     <TemporizadorFactura1Provider initialTime={60}> 
     <TemporizadorFactura2Provider initialTime={60}>
     <TemporizadorFactura3Provider initialTime={60}>

    <AppContent 
  user={user}
  setUser={setUser}                    
  apartmentNumber={apartmentNumber}
   setApartmentNumber={setApartmentNumber} 
  clicked={clicked}
  setClicked={setClicked}
  clickCount={clickCount}
  setClickCount={setClickCount}
  //timerStarted={timerStarted}
  //setTimerStarted={setTimerStarted}
  factura1Terminada={factura1Terminada}
  setFactura1Terminada={setFactura1Terminada}
  factura2Terminada={factura2Terminada}
  setFactura2Terminada={setFactura2Terminada}
  factura3Terminada={factura3Terminada}
  setFactura3Terminada={setFactura3Terminada}
  isProcessing={isProcessing}          
  setIsProcessing={setIsProcessing}  
  //timerStarted={timerStarted}
  //setTimerStarted={setTimerStarted}
 
/>

  </TemporizadorFactura3Provider>
  </TemporizadorFactura2Provider>
  </TemporizadorFactura1Provider> 
  </TemporizadorProvider>


 ) : isRegistering ? (
  <Register 
    onRegister={({ username, apartmentNumber }) => {
      console.log("onRegister -> username:", username, "apartmentNumber:", apartmentNumber); 

      setUser(username);
      setApartmentNumber(apartmentNumber);
      localStorage.setItem('apartmentNumber', apartmentNumber);

     
      console.log("localStorage después de onRegister:", localStorage.getItem('apartmentNumber'));

      //  Ejecutar fetchDatosIniciales inmediatamente para usuario nuevo
      fetchDatosIniciales(apartmentNumber);
    }}
    goToLogin={() => setIsRegistering(false)} 
  />
) : (
  <Login
    onLogin={({ username, apartmentNumber }) => {
      console.log("onLogin -> username:", username, "apartmentNumber:", apartmentNumber); //  log

      setUser(username);
      setApartmentNumber(apartmentNumber);
      localStorage.setItem('apartmentNumber', apartmentNumber);

      // Verificación inmediata
      console.log("localStorage después de onLogin:", localStorage.getItem('apartmentNumber'));
      
      // No es necesario llamar fetchDatosIniciales aquí porque el useEffect se encargará
    }}
    goToRegister={() => setIsRegistering(true)} 
/>


  );
}

function AppContent({
  user, 
  apartmentNumber,
  clicked, 
  setClicked,
  clickCount,
  setClickCount,
  factura1Terminada, 
  setFactura1Terminada,
  factura2Terminada,
  setFactura2Terminada,
  factura3Terminada,
  setFactura3Terminada,
  isProcessing, 
  setIsProcessing,
  setUser,                
  setApartmentNumber     
}) {

  
 const navigate = useNavigate();
 const { timeLeftFactura1, setTimeLeftFactura1 } = useTemporizadorFactura1();
 const { timeLeftFactura2, setTimeLeftFactura2, startFactura2 } = useTemporizadorFactura2();
 const { timeLeftFactura3, setTimeLeftFactura3, startFactura3 } = useTemporizadorFactura3();



  const { 
    timeLeft, 
    setTimeLeft, 
    fondoRojo, 
    setFondoRojo, 
    startCountdown, 
    isRunning, 
    formatTimeLeft,   
    stopAndPersist 
  } = useTemporizador();



  // Restaurar datos desde backend
  useEffect(() => {
    if (apartmentNumber) {
      restaurarDatos({
        apartmentNumber,
        startCountdown,
        setClickCount,
        setFondoRojo,
        setTimeLeft,
      setTimeLeftFactura1,
      setTimeLeftFactura2,
      setTimeLeftFactura3,
      startFactura2,   
      startFactura3,   
  

      });
    }

  }, [apartmentNumber]);




useEffect(() => {
  localStorage.setItem("timeLeftFactura2", timeLeftFactura2);
}, [timeLeftFactura2]);

useEffect(() => {
  localStorage.setItem("timeLeftFactura3", timeLeftFactura3);
}, [timeLeftFactura3]);




  // 🛑 Botón automático "Cerrar sesión" al cerrar pestaña o actualizar 
useEffect(() => {
  if (!apartmentNumber) return;

  const handleBeforeUnload = async (event) => {
    console.log("👋 Cerrando sesión automática (beforeunload)...");

    // 1️⃣ Enviar al backend ANTES de limpiar estado
    await cerrarSesionGlobal({
      auto: true,
      temporizadorPrincipal: timeLeft,
      temporizadorFactura1: timeLeftFactura1, 
      temporizadorFactura2: timeLeftFactura2, 
      temporizadorFactura3: timeLeftFactura3, 
      userId: apartmentNumber,
    });

    // 2️⃣ Resetear estado en la UI
    setUser(null);
    setApartmentNumber(null);

    // 3️⃣ (Opcional) recargar para asegurar limpieza
    // window.location.reload();

    // 🔒 Evita que algunos navegadores cierren sin guardar cambios
    event.preventDefault();
    event.returnValue = '';
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [apartmentNumber, timeLeft, timeLeftFactura1,timeLeftFactura2,timeLeftFactura3, clickCount]);



// 🚨 Botón manual "Cerrar sesión"
const handleCerrarSesion = async () => {
  console.log("👋 Cerrando sesión manual...");

  // 1️⃣ Enviar al backend ANTES de limpiar estado
  await cerrarSesionGlobal({
    auto: false,
    temporizadorPrincipal: timeLeft,
    temporizadorFactura1: timeLeftFactura1,
    temporizadorFactura2: timeLeftFactura2, 
    temporizadorFactura3: timeLeftFactura3,
    statusActual: clickCount,
    userId: apartmentNumber,
  });

  // 2️⃣ Resetear estado en la UI
  setUser(null);
  setApartmentNumber(null);

  // 3️⃣ Recargar para asegurar que todo queda limpio
  window.location.reload();
};




  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100vh",
              backgroundColor: fondoRojo ? "red" : "#282c34",
              color: "white",
              fontFamily: "Arial, sans-serif",
              padding: "20px",
              textAlign: "center",
            }}



          >
            <h1 style={{ fontSize: "20px" }}>
              Hola, {user}! Apto: {apartmentNumber}
            </h1>

            {clickCount > 0 && (

              <div style={{ fontSize: "21px", fontWeight: "bold" }}>
               
              PLAZO DE PAGO {formatTimeLeft(timeLeft)}

             <FaClock
              style={{
                fontSize: "2.0rem",
                color: "white",
                animation: "pulse 1s infinite",
                marginBottom: "5px",
              }}
            />
              </div>
            )}
            
{/*contenedores (depende de la logica del archivo src/components/contenedoresPaginaPrincipal.jsx) */}                               
 <ContenedoresPaginaPrincipal
  clickCount={clickCount}
  factura1Terminada={factura1Terminada}
  factura2Terminada={factura2Terminada}
  factura3Terminada={factura3Terminada}
  setFactura1Terminada={setFactura1Terminada}
  setFactura2Terminada={setFactura2Terminada}
  setFactura3Terminada={setFactura3Terminada}
  clicked={clicked}
  setClicked={setClicked}
/> 

<footer style={{
  display: 'flex',
  justifyContent: 'center',
  transform: 'translateY(-240px)'

}}>
  <div style={{
    backgroundColor: 'transparent',
    width: '250px',
    height: '70px',
    marginTop: '90px',
    marginLeft: '100px',
    borderRadius: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>

  
      {(clickCount > 0 || isRunning) && timeLeft > 0 && (
  <BotonPrincipal 
    clickCount={clickCount}
    setClickCount={setClickCount}
    isProcessing={isProcessing}
    setIsProcessing={setIsProcessing}
    apartmentNumber={apartmentNumber}
    startCountdown={startCountdown}
  />
)}

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
 
 <button
  onClick={handleCerrarSesion}
  style={{
    alignSelf: 'center',
    marginTop: '190px',
    marginLeft: '-250px',
    padding: '6px 6px',
    fontSize: '0.9rem',
    borderRadius: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  }}
>
  Cerrar 🔒
</button>

</div>
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
