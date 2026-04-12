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
        mostrarMensaje("Error", "Completa todos los campos");
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

        return res.text(); // tu backend devuelve string "Login correcto"
    })
    .then(() => {

        mostrarMensaje("Éxito", "Login correcto");

        localStorage.setItem("usuario", usuario);

        window.location.href = "PaginaIntegracion.html";
    })
    .catch(err => {
        console.error("Error login:", err);
        mostrarMensaje("Error", err.message);
    });

}