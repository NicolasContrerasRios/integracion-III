document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btnlogin")
        .addEventListener("click", iniciarSesion);

});

// LOGIN

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
    .then(res => {
        if (!res.ok) throw new Error("Error en login");
        return res.json();
    })
    .then(data => {
        alert("Login correcto");
        localStorage.setItem("usuario", usuario);
        window.location.href = "PaginaIntegracion.html";
    })
    .catch(err => {
        console.error("Error login:", err);
        alert("Usuario o clave incorrectos");
    });
            
}

