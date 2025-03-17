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
    try {
        let peso = parseFloat(document.getElementById("peso").value);
        let ayuno = parseFloat(document.getElementById("ayuno").value);  // Asegúrate de que ayuno sea un número
        let foto = document.getElementById("foto").files[0];

        // Validación de entrada
        if (isNaN(peso) || isNaN(ayuno) || peso <= 0 || ayuno <= 0) {
            alert("Por favor ingresa peso y horas de ayuno válidos.");
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
                imc: isNaN(imc) ? 0 : imc,  // Asegurarse de que imc sea un número
                categoriaIMC
            };
            datos.push(nuevaEntrada);
            localStorage.setItem("historial", JSON.stringify(datos));
            mostrarDatos();
        };

        // Si hay foto, leerla, de lo contrario solo guardar los datos sin foto
        if (foto) {
            reader.readAsDataURL(foto);
        } else {
            let imc = calcularIMC(peso);
            let categoriaIMC = clasificarIMC(imc);
            let nuevaEntrada = { fecha, peso, ayuno, foto: null, imc: isNaN(imc) ? 0 : imc, categoriaIMC };
            datos.push(nuevaEntrada);
            localStorage.setItem("historial", JSON.stringify(datos));
            mostrarDatos();
        }
    } catch (error) {
        console.error("Error al guardar los datos:", error);
        alert("Ocurrió un error al guardar los datos.");
    }
}

// Función para mostrar los datos
function mostrarDatos() {
    try {
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

            // Mostrar el IMC y su clasificación, asegurándose de que IMC sea un número
            let imcTexto = document.createElement("p");
            if (typeof entry.imc === 'number' && !isNaN(entry.imc)) {
                imcTexto.textContent = `IMC: ${entry.imc.toFixed(2)} - ${entry.categoriaIMC}`;
            } else {
                imcTexto.textContent = `IMC no disponible - ${entry.categoriaIMC}`;
            }
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
    } catch (error) {
        console.error("Error al mostrar los datos:", error);
    }
}

// Función para eliminar un registro
function eliminarRegistro(fecha) {
    
        let datos = JSON.parse(localStorage.getItem("historial")) || [];
        
        // Filtrar el registro específico que corresponde a la fecha
        const datosActualizados = datos.filter(entry => entry.fecha !== fecha);
        
        // Si los datos han cambiado (hay elementos restantes)
        if (datosActualizados.length !== datos.length) {
            localStorage.setItem("historial", JSON.stringify(datosActualizados)); // Guardar los datos actualizados en el localStorage
        }

        mostrarDatos();  // Volver a mostrar los datos actualizados
   



        mostrarDatos();  // Volver a mostrar los datos actualizados
     catch (error) {
        console.error("Error al eliminar el registro:", error);
    }
}


// Mostrar los datos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarDatos);
