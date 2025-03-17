// Cargar datos guardados
document.addEventListener("DOMContentLoaded", mostrarDatos);

function guardarDatos() {
    let peso = document.getElementById("peso").value;
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
        let nuevaEntrada = { fecha, peso, ayuno, foto: event.target.result };
        datos.push(nuevaEntrada);
        localStorage.setItem("historial", JSON.stringify(datos));
        mostrarDatos();
    };

    if (foto) {
        reader.readAsDataURL(foto);
    } else {
        let nuevaEntrada = { fecha, peso, ayuno, foto: null };
        datos.push(nuevaEntrada);
        localStorage.setItem("historial", JSON.stringify(datos));
        mostrarDatos();
    }
}

function mostrarDatos() {
    let datos = JSON.parse(localStorage.getItem("historial")) || [];
    let imagenesDiv = document.getElementById("imagenes");
    let ctx = document.getElementById("grafica").getContext("2d");

    imagenesDiv.innerHTML = "";
    let pesos = [], fechas = [];

    datos.forEach(entry => {
        fechas.push(entry.fecha);
        pesos.push(entry.peso);

        if (entry.foto) {
            let img = document.createElement("img");
            img.src = entry.foto;
            img.width = 100;
            imagenesDiv.appendChild(img);
        }
    });

    new Chart(ctx, {
        type: "line",
        data: {
            labels: fechas,
            datasets: [{
                label: "Peso (kg)",
                data: pesos,
                borderColor: "blue",
                fill: false
            }]
        }
    });
}
