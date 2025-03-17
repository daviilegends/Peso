// Función para calcular el IMC
function calcularIMC(peso) {
    const altura = 174 / 100;  // Altura en metros
    const imc = peso / (altura * altura);
    return imc;
}

// Función para clasificar el IMC
function clasificarIMC(imc) {
    if (imc < 18.5) {
        return 'bajo-peso';
    } else if (imc >= 18.5 && imc < 24.9) {
        return 'normal';
    } else if (imc >= 25 && imc < 29.9) {
        return 'sobrepeso';
    } else {
        return 'obesidad';
    }
}

// Función para guardar los datos
function guardarDatos() {
    let peso = parseFloat(document.getElementById("peso").value);
    let ayuno = document.getElementById("ayuno").value;
    let foto = document.getElementById("foto").files[0];

    if (!peso || !ayuno) {
        alert("Por favor ingresa peso y horas de ayuno.");
        return;
    }

    let fecha = new Date().toLocaleDateString();
    let datos = JSON.parse(localStorage.getItem("historial")) || [];

    let reader = new FileReader();
    reader.onload = function (event) {
        let imc = calcularIMC(peso);
        let categoriaIMC = clasificarIMC(imc);
        let nuevaEntrada = {
            fecha,
            peso,
            ayuno,
            foto: event.target.result,
            imc,
            categoriaIMC
        };
        datos.push(nuevaEntrada);
        localStorage.setItem("historial", JSON.stringify(datos));
        mostrarDatos();
    };

    if (foto) {
        reader.readAsDataURL(foto);
    } else {
        let imc = calcularIMC(peso);
        let categoriaIMC = clasificarIMC(imc);
        let nuevaEntrada = { fecha, peso, ayuno, foto: null, imc, categoriaIMC };
        datos.push(nuevaEntrada);
        localStorage.setItem("historial", JSON.stringify(datos));
        mostrarDatos();
    }
}

// Función para mostrar los datos
function mostrarDatos() {
    let datos = JSON.parse(localStorage.getItem("historial")) || [];
    let listaRegistros = document.getElementById("registros-lista");
    listaRegistros.innerHTML = "";  // Limpiar lista antes de mostrar

    datos.forEach(entry => {
        let registroDiv = document.createElement("div");
        registroDiv.classList.add("registro");

        // Mostrar la foto si existe
        if (entry.foto) {
            let img = document.createElement("img");
            img.src = entry.foto;
            img.alt = "Foto";
            registroDiv.appendChild(img);
        }

        // Mostrar los datos de peso y ayuno
        let p = document.createElement("p");
        p.textContent = `Peso: ${entry.peso} kg | Ayuno: ${entry.ayuno} horas`;
        registroDiv.appendChild(p);

        // Mostrar el IMC y su clasificación
        let imcTexto = document.createElement("p");
        imcTexto.textContent = `IMC: ${entry.imc.toFixed(2)} - ${entry.categoriaIMC}`;
        registroDiv.appendChild(imcTexto);

        // Barra de IMC
        let barraIMC = document.createElement("div");
        barraIMC.classList.add("imc-bar", entry.categoriaIMC);
        registroDiv.appendChild(barraIMC);

        // Botón de eliminar
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = function () {
            if (confirm("¿Estás seguro de eliminar este registro?")) {
                eliminarRegistro(entry.fecha);
            }
        };
        registroDiv.appendChild(btnEliminar);

        listaRegistros.appendChild(registroDiv);
    });
}

// Función para eliminar un registro
function eliminarRegistro(fecha) {
    let datos = JSON.parse(localStorage.getItem("historial")) || [];
    datos = datos.filter(entry => entry.fecha !== fecha);
    localStorage.setItem("historial", JSON.stringify(datos));
    mostrarDatos();
}

// Mostrar los datos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarDatos);
