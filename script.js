// Cargar LZString para comprimir datos
const LZString = {
    compressToUTF16: (str) => btoa(unescape(encodeURIComponent(str))),
    decompressFromUTF16: (str) => decodeURIComponent(escape(atob(str))),
};

// Función para obtener el historial de `localStorage`
function obtenerHistorial() {
    const datosComprimidos = localStorage.getItem("historial");
    return datosComprimidos ? JSON.parse(LZString.decompressFromUTF16(datosComprimidos)) : [];
}

// Función para guardar historial de forma optimizada
function guardarHistorial(nuevoRegistro) {
    let historial = obtenerHistorial();

    // Agregar nuevo registro
    historial.push(nuevoRegistro);

    // Si hay demasiados registros, eliminar los más antiguos
    if (historial.length > 50) {
        historial = historial.slice(-50);
    }

    // Intentar guardar en `localStorage`
    try {
        const datosComprimidos = LZString.compressToUTF16(JSON.stringify(historial));
        localStorage.setItem("historial", datosComprimidos);
    } catch (e) {
        if (e.name === "QuotaExceededError") {
            console.warn("⚠️ Se ha superado la cuota de localStorage. Limpiando datos...");
            localStorage.removeItem("historial");
        }
    }
}

// Función para ver el tamaño del almacenamiento
function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage.getItem(key).length;
        }
    }
    console.log(`📦 Tamaño total en localStorage: ${total / 1024} KB`);
}

// Función para limpiar historial manualmente
function limpiarHistorial() {
    localStorage.removeItem("historial");
    console.log("🗑️ Historial limpiado.");
}

// 📌 Ejemplo de uso:
guardarHistorial({ accion: "Usuario inició sesión", fecha: new Date().toISOString() });
console.log("📜 Historial actualizado:", obtenerHistorial());
getStorageSize();
