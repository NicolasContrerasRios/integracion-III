// ================== CAMBIO DE VISTAS ==================

document.querySelectorAll(".filtro-item").forEach(item => {
    item.addEventListener("click", () => {

        let valor = item.getAttribute("data-value");
        let img = item.querySelector("img").src;
        let texto = item.querySelector("h4").innerText;

        // actualizar botón
        filtroImg.src = img;
        filtroTexto.innerText = texto;

        // ocultar vistas
        document.querySelectorAll(".vista").forEach(v => {
            v.classList.remove("activa");
        });

        // mostrar vista
        document.getElementById("vista-" + valor).classList.add("activa");

        
        if (valor === "vehiculos") {
            cargarVehiculos();
            cargarListaVehiculos();
        }

        if (valor === "historial") {
            cargarHistorial();
        }

        if (valor === "retrasos") {
            cargarRetrasos();
        }

        if (valor === "grafico") {
            cargarDatosGrafico();
        }

        // cerrar panel
        filtroPanel.style.display = "none";
    });
});

// cerrarse si se hace un click fuera
document.addEventListener("click", (e) => {
    if (!document.querySelector(".filtro-procesos").contains(e.target)) {
        filtroPanel.style.display = "none";
    }
});

