// ================== MENÚ SUPERIOR ==================

const filtroBtn = document.getElementById("filtroBtn");
const filtroPanel = document.getElementById("filtroPanel");

filtroBtn.addEventListener("click", () => {
    filtroPanel.style.display =
        filtroPanel.style.display === "block" ? "none" : "block";
});