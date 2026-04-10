console.log("JS funcionando");

document.addEventListener("DOMContentLoaded", () => {
    cargarHistorial();
    cargarRetrasos();
    cargarVehiculos();
    cargarConductores();
    cargarListaVehiculos();
    cargarEstados();
    cargarDatosGrafico(); 
    setInterval(cargarDatosGrafico, 5000);

    document.getElementById("boton-guardar-vehiculo")
    .addEventListener("click", agregarVehiculo);

    document.getElementById("boton-guardar-cambios")
    .addEventListener("click", guardarCambios);
    
});

//TABLAS INGRESO Y SALIDA 
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


//TABLAS RETRASOS
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

//TABLA VEHICULOS
function cargarVehiculos() {

    fetch("http://localhost:5087/api/Vehiculo") 
        .then(res => res.json())
        .then(data => {

            console.log("VEHICULOS:", data);

            const tabla = document.getElementById("tabla-vehiculos-bd");
            tabla.innerHTML = "";

            data.forEach(v => {

                const fila = document.createElement("tr");

                // estado con color
                let estadoClase = "";
                const estado = (v.estado || "").toLowerCase();

                if (estado === "disponible") estadoClase = "estado-disponible";
                else if (estado === "en transito") estadoClase = "estado-transito";
                else estadoClase = "estado-fuera";

                fila.innerHTML = `
                    <td><img src="https://icones.pro/wp-content/uploads/2021/11/icone-orange-de-camion-d-expedition-et-de-livraison.png" class="icono-camion"></td>
                    <td>${v.patente}</td>
                    <td>${v.conductor?.nombre || "Sin conductor"}</td>
                    <td class="${estadoClase}">${v.estado}</td>
                    <td>${v.fecha || "-"}</td>
                    <td>${v.hora || "-"}</td>
                `;

                tabla.appendChild(fila);
            });

        })
        .catch(err => console.error("Error vehículos:", err));
}

//ADMINISTRADOR
function agregarVehiculo() {

    const patente = document.getElementById("ingresar-patente").value.trim();
    const nombre = document.getElementById("ingresar-nombre-camion").value.trim();
    const rutConductor = document.getElementById("ingresar-conductor").value;

    // VALIDACIÓN
    if (!patente || !nombre || !rutConductor) {
        alert("Completa todos los campos");
        return;
    }

    // CONFIRMACIÓN
    const confirmar = confirm("¿Seguro que quieres agregar este vehículo?");
    if (!confirmar) return;

    const nuevoVehiculo = {
        patente: patente,
        NombreVehiculo: nombre,
        RutConductor: rutConductor
    };

    console.log("ENVIANDO:", nuevoVehiculo);

    fetch("http://localhost:5087/api/vehiculo/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoVehiculo)
    })
    .then(async res => {
        const texto = await res.text(); 
        console.log("RESPUESTA BACKEND:", texto);

        if (!res.ok) {
            throw new Error(texto);
        }

        return JSON.parse(texto);
    })
    .then(data => {
        console.log("Vehículo guardado:", data);
        alert("Vehículo agregado correctamente");

        document.getElementById("ingresar-patente").value = "";
        document.getElementById("ingresar-nombre-camion").value = "";
        document.getElementById("ingresar-conductor").value = "";

        cargarVehiculos();
    })
    .catch(err => {
        console.error("Error REAL:", err.message);
        alert("Error: " + err.message);
    });
}

function cargarConductores() {

    fetch("http://localhost:5087/api/vehiculo/conductores")
        .then(res => res.json())
        .then(data => {

            console.log("CONDUCTORES:", data);

            const selectAgregar = document.getElementById("ingresar-conductor");
            const selectModificar = document.getElementById("modificar-conductor-modificar");

            selectAgregar.innerHTML = '<option value="">Seleccionar conductor</option>';
            selectModificar.innerHTML = '<option value="">Seleccionar conductor</option>';

            const unicos = {};

            data.forEach(c => {
                if (!unicos[c.rut]) {
                    unicos[c.rut] = c;
                }
            });

            Object.values(unicos).forEach(c => {

                const option = `<option value="${c.rut}">${c.nombre}</option>`;

                selectAgregar.innerHTML += option;
                selectModificar.innerHTML += option;
            });

        })
        .catch(err => console.error("Error conductores:", err));
}


function cargarListaVehiculos() {

    fetch("http://localhost:5087/api/Vehiculo")
        .then(res => res.json())
        .then(data => {

            const lista = document.getElementById("lista-vehiculos");
            lista.innerHTML = "";

            data.forEach(v => {

                const item = document.createElement("p");
                item.textContent = v.patente;

                // CLICK
                item.addEventListener("click", () => {
                    seleccionarVehiculo(v);
                });

                lista.appendChild(item);
            });

        })
        .catch(err => console.error("Error lista vehículos:", err));
}

let vehiculoSeleccionado = null;

function seleccionarVehiculo(v) {

    vehiculoSeleccionado = v;

    //estado
    document.getElementById("modificar-estado-modificar").value = v.estado || "";

    //conductor → buscar por nombre
    const select = document.getElementById("modificar-conductor-modificar");

    for (let option of select.options) {
        if (option.text === v.conductor?.nombre) {
            select.value = option.value;
            break;
        }
    }
}

function guardarCambios() {

    if (!vehiculoSeleccionado) {
        alert("Selecciona un vehículo primero");
        return;
    }

    const rutConductor = document.getElementById("modificar-conductor-modificar").value;
    const estado = document.getElementById("modificar-estado-modificar").value.trim();

    if (!rutConductor || !estado) {
        alert("Completa los campos");
        return;
    }

    const confirmar = confirm("¿Guardar cambios?");
    if (!confirmar) return;

    const vehiculoModificado = {
        patente: vehiculoSeleccionado.patente,
        RutConductor: rutConductor,
        estado: estado
    };

    console.log("ENVIANDO:", vehiculoModificado);

    fetch("http://localhost:5087/api/vehiculo/modificar", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehiculoModificado)
    })
    .then(async res => {
        const texto = await res.text();
        console.log("RESPUESTA:", texto);

        if (!res.ok) throw new Error(texto);

        return texto ? JSON.parse(texto) : {};
    })
    .then(() => {
        alert("Vehículo actualizado");

        // refrescar TODO
        cargarVehiculos();
        cargarListaVehiculos();
    })
    .catch(err => {
        console.error(err);
        alert("Error al actualizar");
    });
}
