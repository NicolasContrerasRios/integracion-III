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

function cargarDatosGrafico() {
    fetch("http://localhost:5087/api/orden")
        .then(res => res.json())
        .then(data => {

            const conteo = {};

            data.forEach(orden => {

                if (!orden.fechaEntrada) return;

                const fecha = orden.fechaEntrada.split("T")[0];

                conteo[fecha] = (conteo[fecha] || 0) + 1;
            });

            const labels = Object.keys(conteo)
                .sort((a, b) => new Date(a) - new Date(b));

            const valores = labels.map(fecha => conteo[fecha]);

            actualizarGrafico(labels, valores);

            actualizarPaneles(data);
        })
        .catch(err => console.error("Error gráfico:", err));
}

function actualizarPaneles(data) {

    const hoy = new Date().toISOString().split("T")[0];
    const mes = new Date().getMonth();
    const anio = new Date().getFullYear();

    let hoyCount = 0;
    let mesCount = 0;

    data.forEach(o => {

        const fecha = new Date(o.fechaEntrada);

        if (o.fechaEntrada.split("T")[0] === hoy) {
            hoyCount++;
        }

        if (fecha.getMonth() === mes && fecha.getFullYear() === anio) {
            mesCount++;
        }
    });

    document.getElementById("cantidad-completadas-hoy").textContent = hoyCount;
    document.getElementById("cantidad-completadas-mes").textContent = mesCount;
}