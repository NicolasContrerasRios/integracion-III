document.addEventListener("DOMContentLoaded", () => {
    cargarHistorial();
});

function cargarHistorial() {

    fetch("http://localhost:5087/api/registro/historial")
        .then(response => response.json())
        .then(data => {

            const tabla = document.getElementById("tabla-ingreso");
            tabla.innerHTML = "";

            let todos = [];

            // 🔹 ENTRADAS
            data.Entradas.forEach(e => {
                todos.push({
                    patente: e.patente,
                    conductor: e.conductor,
                    fecha: e.fecha,
                    hora: e.hora,
                    tipo: "Entrada"
                });
            });

            // 🔹 SALIDAS
            data.Salidas.forEach(s => {
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