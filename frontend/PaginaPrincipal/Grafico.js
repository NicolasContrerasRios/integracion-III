// ================== GRÁFICO ==================

const ctx = document.getElementById('miGrafico');

const grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: '#ff6600',
            backgroundColor: 'rgba(255,102,0,0.2)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4
        }]
    },
options: {
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'TIEMPO'
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'PAQUETES'
            }
        }
    }
}
});

// FUNCIÓN PARA ACTUALIZAR
function actualizarGrafico(labels, datos) {
    grafico.data.labels = labels; //tiempo
    grafico.data.datasets[0].data = datos; //paquetes entregados
    grafico.update();
}


// ================== CONEXIÓN BACKEND ==================

function cargarDatosGrafico() {
    fetch("http://localhost:3000/grafico") // cambia por el backend
        .then(res => res.json())
        .then(data => {
            actualizarGrafico(data.labels, data.datos);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// cargar al inicio
cargarDatosGrafico();

// actualizar cada 5 segundos automáticamente
setInterval(cargarDatosGrafico, 5000);


// ================== MENÚ SUPERIOR ==================

const filtroBtn = document.getElementById("filtroBtn");
const filtroPanel = document.getElementById("filtroPanel");

filtroBtn.addEventListener("click", () => {
    filtroPanel.style.display =
        filtroPanel.style.display === "block" ? "none" : "block";
});


// ================== CAMBIO DE VISTAS ==================

const filtroImg = document.getElementById("filtroImg");
const filtroTexto = document.getElementById("filtroTexto");

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


// ================== EFECTO DEL ENCABEZADO ==================

const header = document.querySelector(".encabezado-bar");

header.classList.add("normal");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.remove("normal");
        header.classList.add("transparente");
    } else {
        header.classList.remove("transparente");
        header.classList.add("normal");
    }
});

