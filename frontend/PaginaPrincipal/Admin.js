const btnAgregar = document.getElementById("boton-agregar-vehiculo");
const btnModificar = document.getElementById("boton-modificar-vehiculo");

const panelAgregar = document.getElementById("panel-agregar-vehiculo");
const panelModificar = document.getElementById("panel-modificar-vehiculo");

btnAgregar.onclick = function() {
    panelAgregar.classList.add("activo");
    panelModificar.classList.remove("activo");

    btnAgregar.classList.add("activo");
    btnModificar.classList.remove("activo");
};

btnModificar.onclick = function() {
    panelModificar.classList.add("activo");
    panelAgregar.classList.remove("activo");

    btnModificar.classList.add("activo");
    btnAgregar.classList.remove("activo");
};

const toggle = document.getElementById("cambiarModo");

// cargar preferencia guardada
if (localStorage.getItem("modo") === "oscuro") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
}

// evento del switch
toggle.addEventListener("change", () => {
    if (toggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("modo", "oscuro");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("modo", "claro");
    }
});
