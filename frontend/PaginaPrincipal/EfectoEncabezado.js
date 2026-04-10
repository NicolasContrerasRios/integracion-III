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

