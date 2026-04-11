document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.getElementById("btnlogin");

    if (btnLogin) {
        btnLogin.addEventListener("click", iniciarSesion);
    }

});

function iniciarSesion() {

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();

    // VALIDACIÓN
    if (!usuario || !clave) {
        alert("Completa todos los campos");
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

        // si el backend falla
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Error en login");
        }

        return res.json();
    })
    .then(data => {

        alert("Login correcto");

        // guardamos sesión simple
        localStorage.setItem("usuario", usuario);

        // redirección
        window.location.href = "PaginaIntegracion.html";
    })
    .catch(err => {
        console.error("Error login:", err);
        alert("Usuario o clave incorrectos");
    });

}