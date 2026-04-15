
let paginaVehiculos = 1;
let paginaIngreso = 1;
let paginaRetrasos = 1;

const filasVehiculos = 10;
const filasIngreso = 10;
const filasRetrasos = 5;


document.addEventListener("DOMContentLoaded", () => {

    // Se ejecuta solo si se esta en la pagina principal
    if (document.getElementById("tabla-ingreso")) {
        cargarHistorial();
        cargarRetrasos();
        cargarVehiculos();
        cargarConductores();
        cargarListaVehiculos();
        cargarDatosGrafico();
        setInterval(cargarDatosGrafico, 5000);
    }

    // BOTONES ADMIN
    document.getElementById("boton-guardar-vehiculo")
        ?.addEventListener("click", agregarVehiculo);

    document.getElementById("boton-guardar-cambios")
        ?.addEventListener("click", guardarCambios);

    // LOGIN 
    const btnLogin = document.getElementById("btnlogin");
    if (btnLogin) {
        btnLogin.addEventListener("click", iniciarSesion);
    }

    //FILTROS
    document.getElementById("btn-filtrar-ingreso")
    ?.addEventListener("click", () => {
        paginaIngreso = 1;
        actualizarHistorial();
    });

    const inputPatente = document.getElementById("ingresar-patente");

    if (inputPatente) {
        inputPatente.addEventListener("input", () => {
            inputPatente.value = inputPatente.value.toUpperCase();
        });
}

    document.getElementById("btn-limpiar-filtros")
    ?.addEventListener("click", () => {

    document.getElementById("input-buscar-ingreso").value = "";
    document.getElementById("fechaFiltro").value = "";

    paginaIngreso = 1;
    actualizarHistorial();
});



});
// LOGOUT 
const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", () => {

        mostrarConfirmacion("Cerrar sesión", "¿Quieres cerrar sesión?", (ok) => {
            if (!ok) return;

            localStorage.removeItem("usuario");
            window.location.replace("/frontend/inicioSesion/iniciosesionweb.html");
        });

    });
}

    //TABLAS 
    function cargarHistorial() {
        console.log("Entró a cargarHistorial");

        fetch("http://localhost:5087/api/Registro/historial")
            .then(response => response.json())
    .then(data => {

        let todos = [];

        let entradas = data.entradas || [];
        let salidas = data.salidas || [];

        entradas.forEach(e => {
            todos.push({
                patente: e.patente,
                conductor: e.conductor,
                fecha: e.fecha,
                hora: e.hora,
                tipo: "Entrada"
            });
        });

        salidas.forEach(s => {
            todos.push({
                patente: s.patente,
                conductor: s.conductor,
                fecha: s.fecha,
                hora: s.hora,
                tipo: "Salida"
            });
        });

        window.historialGlobal = todos;
        paginaIngreso = 1;
        actualizarHistorial();
    })
    }

function actualizarHistorial() {

    if (paginaIngreso < 1) paginaIngreso = 1;

    const tabla = document.getElementById("tabla-ingreso");
    tabla.innerHTML = "";

    let datos = window.historialGlobal || [];

    // FILTROS
    const patenteFiltro =
        document.getElementById("input-buscar-ingreso")?.value.toLowerCase() || "";

    const fechaFiltro =
        document.getElementById("fechaFiltro")?.value || "";

    // aplicar filtros
    datos = datos.filter(r => {

        const coincidePatente =
            r.patente.toLowerCase().includes(patenteFiltro);

        const coincideFecha =
            !fechaFiltro || r.fecha === fechaFiltro;

        return coincidePatente && coincideFecha;
    });

    //  paginación
    const inicio = (paginaIngreso - 1) * filasIngreso;
    const fin = inicio + filasIngreso;

    const pagina = datos.slice(inicio, fin);

    pagina.forEach(r => {
        tabla.innerHTML += `
            <tr>
                <td>
                    <img src="https://icones.pro/wp-content/uploads/2021/11/icone-orange-de-camion-d-expedition-et-de-livraison.png" class="icono-camion"></td>
                <td>${r.patente}</td>
                <td>${r.conductor}</td>
                <td>${r.fecha}</td>
                <td>${r.tipo}</td>
                <td>${r.hora}</td>
            </tr>
        `;
    });

    document.getElementById("paginaIngreso").textContent = paginaIngreso;
}
function cargarRetrasos() {

    fetch("http://localhost:5087/api/Registro/atrasos")
        .then(res => res.json())
        .then(data => {

            console.log("ATRASOS:", data);

            let registros = data.registro || data.Registro || [];
            let detalles = data.detalles || data.Detalles || [];

            // guardar globalmente los datos
            window.retrasosGlobal = registros;
            window.detallesGlobal = detalles;

            // reinicia página
            paginaRetrasos = 1;

            actualizarRetrasos();
        })
        .catch(err => console.error("Error atrasos:", err));
}

function mostrarDetalle(patente, detalles) {

    const detalle = detalles.find(d => d.patente === patente);

    if (!detalle) return;

    document.getElementById("detalle-hora-salida").textContent = detalle.hora_Entrada;
    document.getElementById("detalle-horario").textContent = detalle.hora_Salida;
    document.getElementById("detalle-conductor").textContent = detalle.conductor;

    const campos = document.querySelectorAll(".panel-retrasos .campo");
    campos[0].textContent = detalle.fecha;
}

function actualizarRetrasos() {

    if (paginaRetrasos < 1) paginaRetrasos = 1;

    const tabla = document.getElementById("tablaRetrasosBD");
    tabla.innerHTML = "";

    const datos = window.retrasosGlobal || [];
    const detalles = window.detallesGlobal || [];

    const inicio = (paginaRetrasos - 1) * filasRetrasos;
    const fin = inicio + filasRetrasos;

    const pagina = datos.slice(inicio, fin);

    pagina.forEach(r => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td><img src="https://icones.pro/wp-content/uploads/2021/11/icone-orange-de-camion-d-expedition-et-de-livraison.png" class="icono-camion"></td>
            <td>${r.patente}</td>
            <td>${r.fecha}</td>
            <td>${r.horas_Tardadas}</td>
        `;

        fila.addEventListener("click", () => {

            document.querySelectorAll("#tablaRetrasosBD tr")
                .forEach(tr => tr.classList.remove("activo"));

            fila.classList.add("activo");

            mostrarDetalle(r.patente, detalles);
        });

        tabla.appendChild(fila);
    });

    document.getElementById("paginaRetrasos").textContent = paginaRetrasos;
}

function cargarVehiculos() {

    fetch("http://localhost:5087/api/Vehiculo") 
        .then(res => res.json())
        .then(data => {

            console.log("VEHICULOS:", data);

            const tabla = document.getElementById("tabla-vehiculos-bd");
            tabla.innerHTML = "";

            data.forEach(v => {

                const fila = document.createElement("tr");

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

            window.vehiculosGlobal = data;
            paginaVehiculos = 1;
            actualizarVehiculos();

        })
        .catch(err => console.error("Error vehículos:", err));
}
function actualizarVehiculos() {

    if (paginaVehiculos < 1) paginaVehiculos = 1;

    const tabla = document.getElementById("tabla-vehiculos-bd");
    tabla.innerHTML = "";

    const datos = window.vehiculosGlobal || [];

    const inicio = (paginaVehiculos - 1) * filasVehiculos;
    const fin = inicio + filasVehiculos;

    const pagina = datos.slice(inicio, fin);

    pagina.forEach(v => {

        let estadoClase = "";
        const estado = (v.estado || "").toLowerCase();

        if (estado === "disponible") estadoClase = "estado-disponible";
        else if (estado === "en transito") estadoClase = "estado-transito";
        else estadoClase = "estado-fuera";

        tabla.innerHTML += `
            <tr>
                <td><img src="https://icones.pro/wp-content/uploads/2021/11/icone-orange-de-camion-d-expedition-et-de-livraison.png" class="icono-camion"></td>
                <td>${v.patente}</td>
                <td>${v.conductor?.nombre || "Sin conductor"}</td>
                <td class="${estadoClase}">${v.estado}</td>
                <td>${v.fecha || "-"}</td>
                <td>${v.hora || "-"}</td>
            </tr>
        `;
    });

    document.getElementById("paginaVehiculos").textContent = paginaVehiculos;
}

function agregarVehiculo() {

    const patente = document.getElementById("ingresar-patente").value.trim().toUpperCase();
    const nombre = document.getElementById("ingresar-nombre-camion").value.trim();
    const rutConductor = document.getElementById("ingresar-conductor").value;

    // actualizar visualmente el input a mayúsculas
    document.getElementById("ingresar-patente").value = patente;

    if (!patente || !nombre || !rutConductor) {
        mostrarMensaje("Error", "Completa todos los campos");
        return;
    }

    // patente debe tener exactamente 6 caracteres
    if (patente.length < 6) {
        mostrarMensaje("Error", "La patente debe tener al menos 6 caracteres");
        return;
    }

    if (patente.length > 6) {
        mostrarMensaje("Error", "La patente debe tener máximo 6 caracteres");
        return;
    }

    // validar formato ABCD12
    const letras = patente.substring(0, 4);
    const numeros = patente.substring(4, 6);

    if (!/^[A-Z]{4}$/.test(letras)) {
        mostrarMensaje("Error", "Los primeros 4 caracteres deben ser letras");
        return;
    }

    if (!/^[0-9]{2}$/.test(numeros)) {
        mostrarMensaje("Error", "Los últimos 2 caracteres deben ser números");
        return;
    }

    // nombre mínimo
    if (nombre.length < 3) {
        mostrarMensaje("Error", "El nombre del camión debe tener al menos 3 caracteres");
        return;
    }

    // validar nombre: solo letras, números y espacios
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        mostrarMensaje("Error", "El nombre solo puede contener letras y números");
        return;
    }

    // validar que no exista ya la patente
    const existePatente = (window.vehiculosGlobal || []).some(v =>
        v.patente.toUpperCase() === patente
    );

    if (existePatente) {
        mostrarMensaje("Error", "La patente ya existe");
        return;
    }

    mostrarConfirmacion("Agregar vehículo", "¿Seguro que quieres agregar este vehículo?", (ok) => {
        if (!ok) return;

        guardarVehiculoReal();
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

    //buscar por nombre
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
        mostrarMensaje("Error", "Selecciona un vehículo primero");
        return;
    }

    const rutConductor = document.getElementById("modificar-conductor-modificar").value;
    const estado = document.getElementById("modificar-estado-modificar").value.trim();

    if (!rutConductor || !estado) {
        mostrarMensaje("Error", "Completa los campos");
        return;
    }

    mostrarConfirmacion("Guardar cambios", "¿Guardar cambios?", (ok) => {
        if (!ok) return;

        guardarCambiosReal();
    });
}

//CAMBIO DE PAGINAS DE TABLAS

// PAGINACIÓN VEHÍCULOS
function siguienteVehiculos() {
    const total = window.vehiculosGlobal?.length || 0;
    if (paginaVehiculos * filasVehiculos < total) {
        paginaVehiculos++;
        actualizarVehiculos();
    }
}

function anteriorVehiculos() {
    if (paginaVehiculos > 1) {
        paginaVehiculos--;
        actualizarVehiculos();
    }
}

// PAGINACIÓN INGRESO
function siguienteIngreso() {
    const total = window.historialGlobal?.length || 0;
    if (paginaIngreso * filasIngreso < total) {
        paginaIngreso++;
        actualizarHistorial();
    }
}

function anteriorIngreso() {
    if (paginaIngreso > 1) {
        paginaIngreso--;
        actualizarHistorial();
    }
}

// PAGINACIÓN RETRASOS
function siguienteRetrasos() {
    const total = window.retrasosGlobal?.length || 0;
    if (paginaRetrasos * filasRetrasos < total) {
        paginaRetrasos++;
        actualizarRetrasos();
    }
}

function anteriorRetrasos() {
    if (paginaRetrasos > 1) {
        paginaRetrasos--;
        actualizarRetrasos();
    }
}

function mostrarMensaje(titulo, mensaje) {

    const modal = document.getElementById("modalMensaje");

    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalTexto").textContent = mensaje;

    const botones = document.getElementById("modalBotones");
    botones.innerHTML = `<button class="btn-aceptar">OK</button>`;

    modal.style.display = "flex";

    botones.querySelector("button").onclick = () => {
        modal.style.display = "none";
    };
}

function mostrarConfirmacion(titulo, mensaje, callback) {

    const modal = document.getElementById("modalMensaje");

    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalTexto").textContent = mensaje;

    const botones = document.getElementById("modalBotones");

    botones.innerHTML = `
        <button class="btn-cancelar">Cancelar</button>
        <button class="btn-aceptar">Aceptar</button>
    `;

    modal.style.display = "flex";

    botones.querySelector(".btn-aceptar").onclick = () => {
        modal.style.display = "none";
        callback(true);
    };

    botones.querySelector(".btn-cancelar").onclick = () => {
        modal.style.display = "none";
        callback(false);
    };
}

function guardarVehiculoReal() {

    const patente = document.getElementById("ingresar-patente").value.trim();
    const nombre = document.getElementById("ingresar-nombre-camion").value.trim();
    const rutConductor = document.getElementById("ingresar-conductor").value;

    const nuevoVehiculo = {
        patente: patente,
        NombreVehiculo: nombre,
        RutConductor: rutConductor
    };

    fetch("http://localhost:5087/api/vehiculo/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoVehiculo)
    })
    .then(async res => {
        const texto = await res.text();

        if (!res.ok) throw new Error(texto);

        return JSON.parse(texto);
    })
    .then(() => {
        mostrarMensaje("Éxito", "Vehículo agregado correctamente");

        cargarVehiculos();
    })
    .catch(err => {
        mostrarMensaje("Error", err.message);
    });
}

function guardarCambiosReal() {

    const vehiculoModificado = {
        patente: vehiculoSeleccionado.patente,
        RutConductor: document.getElementById("modificar-conductor-modificar").value,
        estado: document.getElementById("modificar-estado-modificar").value.trim()
    };

    fetch("http://localhost:5087/api/vehiculo/modificar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehiculoModificado)
    })
    .then(async res => {
        const texto = await res.text();

        if (!res.ok) throw new Error(texto);

        return texto ? JSON.parse(texto) : {};
    })
    .then(() => {
        mostrarMensaje("Éxito", "Vehículo actualizado");

        cargarVehiculos();
        cargarListaVehiculos();
    })
    .catch(err => {
        mostrarMensaje("Error", err.message);
    });
}

