console.log("JS funcionando");

document.addEventListener("DOMContentLoaded", () => {
    cargarHistorial();
    cargarRetrasos();
    
});

function cargarHistorial() {
    console.log("Entró a cargarHistorial");

    fetch("http://localhost:5087/api/Registro/historial")
        .then(response => response.json())
        .then(data => {
            console.log("DATA:", data);

            const tabla = document.getElementById("tabla-ingreso");
            tabla.innerHTML = "";

            let todos = [];

            // ✅ IMPORTANTE
            let entradas = data.entradas || data.Entradas || [];
            let salidas = data.salidas || data.Salidas || [];

            // 🔹 ENTRADAS
            entradas.forEach(e => {
                todos.push({
                    patente: e.patente || e.Patente,
                    conductor: e.conductor || e.Conductor,
                    fecha: e.fecha || e.Fecha,
                    hora: e.hora || e.Hora,
                    tipo: "Entrada"
                });
            });

            // 🔹 SALIDAS
            salidas.forEach(s => {
                todos.push({
                    patente: s.patente || s.Patente,
                    conductor: s.conductor || s.Conductor,
                    fecha: s.fecha || s.Fecha,
                    hora: s.hora || s.Hora,
                    tipo: "Salida"
                });
            });

            // 🔥 ORDENAR POR FECHA Y HORA
            todos.sort((a, b) => {
                return new Date(b.fecha + " " + b.hora) - new Date(a.fecha + " " + a.hora);
            });

            // 🔹 PINTAR TABLA
            todos.forEach(r => {
                tabla.innerHTML += `
                    <tr>
                        <td><img src="https://icones.pro/wp-content/uploads/2021/11/icone-orange-de-camion-d-expedition-et-de-livraison.png" class="icono-camion"></td>
                        <td>${r.patente}</td>
                        <td>${r.conductor}</td>
                        <td>${r.fecha}</td>
                        <td>${r.tipo}</td>
                        <td>${r.hora}</td>
                    </tr>
                `;
            });

        })
        .catch(error => {
            console.error("Error al cargar datos:", error);
        });
}


function cargarRetrasos() {

    fetch("http://localhost:5087/api/Registro/atrasos")
        .then(res => res.json())
        .then(data => {

            console.log("ATRASOS:", data);

            const tabla = document.getElementById("tablaRetrasosBD");
            tabla.innerHTML = "";

            let registros = data.registro || data.Registro || [];
            let detalles = data.detalles || data.Detalles || [];

            registros.forEach(r => {

                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td><img src="https://icones.pro/wp-content/uploads/2021/11/icone-orange-de-camion-d-expedition-et-de-livraison.png" class="icono-camion"></td>
                    <td>${r.patente}</td>
                    <td>${r.fecha}</td>
                    <td>${r.horas_Tardadas}</td>
                `;

                // 🔥 CLICK EN FILA
                fila.addEventListener("click", () => {

                    // 🔹 quitar selección anterior
                    document.querySelectorAll("#tablaRetrasosBD tr").forEach(tr => {
                        tr.classList.remove("activo");
                    });

                    // 🔹 marcar fila actual
                    fila.classList.add("activo");

                    // 🔹 mostrar detalle
                    mostrarDetalle(r.patente, detalles);
                });

                tabla.appendChild(fila);
            });

        })
        .catch(err => console.error("Error atrasos:", err));
}

function mostrarDetalle(patente, detalles) {

    const detalle = detalles.find(d => d.patente === patente);

    if (!detalle) return;

    document.getElementById("detalle-hora-salida").textContent = detalle.hora_Entrada;
    document.getElementById("detalle-horario").textContent = detalle.hora_Salida;
    document.getElementById("detalle-conductor").textContent = detalle.conductor;

    // fecha (el primero que no tenía id)
    const campos = document.querySelectorAll(".panel-retrasos .campo");
    campos[0].textContent = detalle.fecha;
}

