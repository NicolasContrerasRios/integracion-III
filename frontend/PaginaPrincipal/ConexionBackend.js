document.addEventListener("DOMContentLoaded", () => {
    cargarHistorial();
});

function cargarHistorial() {

    fetch("http://0.0.0.0:5087/api/registro/historial")
        .then(response => response.json())
        .then(data => {

            const tabla = document.getElementById("tabla-ingreso");
            tabla.innerHTML = "";

            let todos = [];

            // 🔹 ENTRADAS
            data.entradas.forEach(e => {
                todos.push({
                    patente: e.patente,
                    conductor: e.conductor,
                    fecha: e.fecha,
                    hora: e.hora,
                    tipo: "Entrada"
                });
            });

            // 🔹 SALIDAS
            data.salidas.forEach(s => {
                todos.push({
                    patente: s.patente,
                    conductor: s.conductor,
                    fecha: s.fecha,
                    hora: s.hora,
                    tipo: "Salida"
                });
            });

            // 🔥 ORDENAR POR FECHA Y HORA
            todos.sort((a, b) => {
                return new Date(a.fecha + " " + a.hora) - new Date(b.fecha + " " + b.hora);
            });

            // 🔹 PINTAR TABLA
            todos.forEach(registro => {

                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>
                        <img src="https://icones.pro/wp-content/uploads/2021/11/icone-orange-de-camion-d-expedition-et-de-livraison.png" class="icono-camion">
                    </td>
                    <td>${registro.patente}</td>
                    <td>${registro.conductor}</td>
                    <td>${registro.fecha}</td>
                    <td class="${registro.tipo === "Entrada" ? "entrada" : "salida"}">
                        ${registro.tipo}
                    </td>
                    <td>${registro.hora}</td>
                `;

                tabla.appendChild(fila);    
            });

        })
        .catch(error => {
            console.error("Error al cargar datos:", error);
        });
}