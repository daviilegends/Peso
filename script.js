// Cargar LZString con Base64 segura
const LZString = {
    compressToBase64: (str) => btoa(unescape(encodeURIComponent(str))),
    decompressFromBase64: (str) => {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (e) {
            console.error("❌ Error al descomprimir datos:", e);
            return "[]"; // Retorna un array vacío si falla la descompresión
        }
    }
};

// Función para obtener el historial de `localStorage`
function obtenerHistorial() {
    const datosComprimidos = localStorage.getItem("historial");
    return datosComprimidos ? JSON.parse(LZString.decompressFromBase64(datosComprimidos)) : [];
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
        const datosComprimidos = LZString.compressToBase64(JSON.stringify(historial));
        localStorage.setItem("historial", datosComprimidos);
        console.log("✅ Historial guardado correctamente.");
    } catch (e) {
        if (e.name === "QuotaExceededError") {
            console.warn("⚠️ Se ha superado la cuota de localStorage. Limpiando datos...");
            localStorage.removeItem("historial");
        }
    }

    // Actualizar la lista en la interfaz
    mostrarHistorial();
}

// Función para eliminar un registro específico por índice
function eliminarRegistro(indice) {
    let historial = obtenerHistorial();
    
    if (indice >= 0 && indice < historial.length) {
        historial.splice(indice, 1); // Eliminar solo el registro en la posición dada

        try {
            const datosComprimidos = LZString.compressToBase64(JSON.stringify(historial));
            localStorage.setItem("historial", datosComprimidos);
            console.log(`🗑️ Registro eliminado en índice ${indice}`);
        } catch (e) {
            console.error("❌ Error al actualizar el historial después de eliminar.");
        }
    } else {
        console.warn("⚠️ Índice no válido.");
    }

    // Actualizar la lista en la interfaz
    mostrarHistorial();
}

// Función para mostrar historial en la interfaz
function mostrarHistorial() {
    const historial = obtenerHistorial();
    const lista = document.getElementById("lista-historial");

    // Limpiar la lista antes de volver a mostrarla
    lista.innerHTML = "";

    historial.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.accion} - ${item.fecha}`;

        // Botón para eliminar registro
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "❌";
        btnEliminar.onclick = () => eliminarRegistro(index);

        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });
}

// Función para limpiar historial manualmente
function limpiarHistorial() {
    localStorage.removeItem("historial");
    console.log("🗑️ Historial limpiado.");

    // Actualizar la lista en la interfaz
    mostrarHistorial();
}

// 📌 Cargar historial al inicio
document.addEventListener("DOMContentLoaded", () => {
    mostrarHistorial();
});
