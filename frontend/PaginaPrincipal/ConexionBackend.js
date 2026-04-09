console.log("JS funcionando");

document.addEventListener("DOMContentLoaded", () => {
    cargarHistorial();
    
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