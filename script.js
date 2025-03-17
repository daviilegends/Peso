document.addEventListener("DOMContentLoaded", mostrarDatos);

function guardarDatos() {
    let peso = parseFloat(document.getElementById("peso").value);
    let ayuno = parseInt(document.getElementById("ayuno").value);
    let foto = document.getElementById("foto").files[0];

    if (!peso || !ayuno) {
        alert("Por favor ingresa peso y horas de ayuno.");
        return;
    }

    let altura = 1.74; // Altura en metros
    let imc = calcularIMC(peso, altura);

    let categoriaIMC = obtenerCategoriaIMC(imc);
    let fecha = new Date().toLocaleDateString();
    let datos = JSON.parse(localStorage.getItem("historial")) || [];

    let reader = new FileReader();
    reader.onload = function (event) {
        let nuevaEntrada = { fecha, peso, ayuno, imc, categoriaIMC, foto: event.target.result };
        datos.push(nuevaEntrada);
        localStorage.setItem("historial", JSON.stringify(datos));
        mostrarDatos();
    };

    if (foto) {
        reader.readAsDataURL(foto);
    } else {
        let nuevaEntrada = { fecha, peso, ayuno, imc, categoriaIMC, foto: null };
        datos.push(nuevaEntrada);
        localStorage.setItem("historial", JSON.stringify(datos));
        mostrarDatos();
    }
}

function mostrarDatos() {
    let datos = JSON.parse(localStorage.getItem("historial")) || [];
    let registrosDiv = document.getElementById("registros");
    let barraIMC = document.getElementById("barraIMC");

    registrosDiv.innerHTML = ""; // Limpiar registros previos
    barraIMC.style.width = "0%"; // Limpiar barra visual

    if (datos.length === 0) {
        registrosDiv.innerHTML = "<p>No hay registros guardados.</p>";
        return;
    }

    // Ordenar los registros por fecha
    datos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    datos.forEach((entry, index) => {
        // Determinar el color del IMC
        let imcColor = determinarColorIMC(entry.imc);

        let registroHTML = `
            <div class="registro" style="color: ${imcColor}">
                <p><strong>Fecha:</strong> ${entry.fecha}</p>
                <p><strong>Peso:</strong> ${entry.peso} kg</p>
                <p><strong>Horas de Ayuno:</strong> ${entry.ayuno} horas</p>
                <p><strong>IMC:</strong> ${entry.imc}</p>
                <p><strong>Categoría IMC:</strong> ${entry.categoriaIMC}</p>
                ${entry.foto ? `<img src="${entry.foto}" width="100">` : ""}
                <button onclick="eliminarRegistro(${index})">Eliminar</button>
            </div>
        `;
        registrosDiv.innerHTML += registroHTML;

        // Actualizar barra visual de IMC
        let categoriaIndex = obtenerCategoriaIndex(entry.imc);
        barraIMC.style.width = `${categoriaIndex}%`;
    });
}

function calcularIMC(peso, altura) {
    return (peso / (altura * altura)).toFixed(2); // IMC = peso / altura^2
}

function obtenerCategoriaIMC(imc) {
    if (imc < 18.5) {
        return "Bajo Peso";
    } else if (imc >= 18.5 && imc <= 24.9) {
        return "Normal";
    } else if (imc >= 25 && imc <= 29.9) {
        return "Sobrepeso";
    } else {
        return "Obesidad";
    }
}

function obtenerCategoriaIndex(imc) {
    // Esto servirá para la barra visual, daremos un porcentaje para cada categoría
    if (imc < 18.5) {
        return 25; // Bajo peso
    } else if (imc >= 18.5 && imc <= 24.9) {
        return 50; // Normal
    } else if (imc >= 25 && imc <= 29.9) {
        return 75; // Sobrepeso
    } else {
        return 100; // Obesidad
    }
}

function eliminarRegistro(index) {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        let datos = JSON.parse(localStorage.getItem("historial")) || [];
        datos.splice(index, 1); // Eliminar el registro en la posición indicada
        localStorage.setItem("historial", JSON.stringify(datos));
        mostrarDatos();
}

// Función para determinar el color del IMC
function determinarColorIMC(imc) {
    if (imc < 18.5) {
        return "red"; // IMC bajo
    } else if (imc >= 18.5 && imc <= 24.9) {
        return "green"; // IMC normal
    } else if (imc >= 25 && imc <= 29.9) {
        return "orange"; // IMC sobrepeso
    } else {
        return "purple"; // IMC obesidad
    }
}
