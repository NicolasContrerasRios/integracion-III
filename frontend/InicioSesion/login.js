document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.getElementById("btnlogin");

    if (btnLogin) {
        btnLogin.addEventListener("click", iniciarSesion);
    }

});

function iniciarSesion() {

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (!usuario || !clave) {
        mostrarMensaje("Completa todos los campos", "error");
        return;
    }

    fetch("http://localhost:5087/api/autentification/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombreUsuario: usuario,
            clave: clave
        })
    })
    .then(async res => {

        if (!res.ok) {
            throw new Error("Usuario o clave incorrectos");
        }

        return res.text();
    })
    .then(() => {

        localStorage.setItem("usuario", usuario);

        window.location.href = "/frontend/PaginaPrincipal/PaginaIntegracion.html";
    })
    .catch(err => {
        console.error("Error login:", err);
        mostrarMensaje(err.message, "error");
    });

}


//FUNCION PARA MOSTRAR MENSAJE DE COMPLETAR CAMPOS

function mostrarMensaje(texto, tipo) {

    const mensaje = document.getElementById("mensaje-login");

    mensaje.textContent = texto;
    mensaje.className = "mensaje-login " + tipo;

    setTimeout(() => {
        mensaje.className = "mensaje-login";
        mensaje.textContent = "";
    }, 3000);
}