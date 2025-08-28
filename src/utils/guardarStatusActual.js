
//CODIGO en produccion 

//este es mi archivo "C:\Users\user\projects\myapp\kiosko\src\utils\guardarStatusActual.js" solo analizalo no modifiques nada  


export const guardarStatusActual = async (nuevoEstado, aptoParam) => {
  try {
    // Obtenemos el número de apartamento
    const apartmentNumber = aptoParam || localStorage.getItem("apartmentNumber");

    if (!apartmentNumber) {
      console.warn("⚠️ No se encontró apartmentNumber para guardar statusActual");
      return;
    }

    console.log(`📤 Enviando a guardar_statusActual: { userId: '${apartmentNumber}', statusActual: '${nuevoEstado}' }`);

    const res = await fetch("https://backend-1uwd.onrender.com/api/realTime/statusActual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: apartmentNumber, // 👈 lo mandamos como userId
        statusActual: nuevoEstado
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al guardar statusActual");

    console.log("✅ StatusActual guardado correctamente");
  } catch (error) {
    console.error("❌ Error al guardar statusActual:", error);
  }
};
