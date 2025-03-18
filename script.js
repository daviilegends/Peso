// Función para obtener el historial de `localStorage`
function obtenerHistorial() {
    const datosComprimidos = localStorage.getItem("historial");
    return datosComprimidos ? JSON.parse(LZString.decompressFromBase64(datosComprimidos)) : [];
}

// Función para guardar historial de forma optimizada
function guardarHistorial() {
    const peso = document.getElementById('peso').value;
    const ayuno = document.getElementById('ayuno').value;
    const foto = document.getElementById('foto').files[0];

    if (!peso || !ayuno) {
        alert("Por favor, completa los campos.");
        return;
    }

    let historial = obtenerHistorial();

    // Crear objeto de registro con la foto si existe
    const nuevoRegistro = {
        peso: peso,
        ayuno: ayuno,
        fecha: new Date().toISOString(),
        foto: foto ? URL.createObjectURL(foto) : null
    };

    // Agregar nuevo registro
    historial.unshift(nuevoRegistro); // Agregar al principio

    // Si hay demasiados registros, eliminar los más antiguos
    if (historial.length > 50) {
        historial = historial.slice(0, 50);
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

    // Limpiar campos
    document.getElementById('peso').value = '';
    document.getElementById('ayuno').value = '';
    document.getElementById('foto').value = '';

    // Actualizar la lista en la interfaz
    mostrarHistorial();
}

// Función para eliminar un registro específico
let registroAEliminar = null;
function eliminarRegistro(indice) {
    registroAEliminar = indice;
    document.getElementById('modal').style.display = 'block';
}

// Confirmación de eliminación
function confirmarEliminar(confirmado) {
    if (confirmado && registroAEliminar !== null) {
        let historial = obtenerHistorial();
        historial.splice(registroAEliminar, 1); // Eliminar solo el registro seleccionado

        try {
            const datosComprimidos = LZString.compressToBase64(JSON.stringify(historial));
            localStorage.setItem("historial", datosComprimidos);
            console.log(`🗑️ Registro eliminado en índice ${registroAEliminar}`);
        } catch (e) {
            console.error("❌ Error al actualizar el historial después de eliminar.");
        }
        mostrarHistorial();
    }

    // Cerrar el modal
    document.getElementById('modal').style.display = 'none';
}

// Función para mostrar historial en la interfaz
function mostrarHistorial() {
    const historial = obtenerHistorial();
    const lista = document.getElementById("lista-historial");

    // Limpiar la lista antes de volver a mostrarla
    lista.innerHTML = "";

    historial.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("registro");
        li.innerHTML = `
            <p>Peso: ${item.peso} kg</p>
            <p>Horas de ayuno: ${item.ayuno}</p>
            <p>Fecha: ${item.fecha}</p>
            ${item.foto ? `<img src="${item.foto}" alt="Imagen">` : ''}
        `;

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
    mostrarHistorial();
}

// 📌 Cargar historial al inicio
document.addEventListener("DOMContentLoaded", () => {
    mostrarHistorial();
});
