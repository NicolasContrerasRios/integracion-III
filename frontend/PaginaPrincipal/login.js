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

    fetch("http://localhost:5087/api/login") 
        .then(res => res.json())
        .then(data => {

            const encontrado = data.find(u => 
                u.nombreUsuario === usuario && u.clave === clave
            );

            if (encontrado) {
                alert("Login correcto");

                // REDIRECCIÓN
                window.location.href = "PaginaIntegracion.html";
            } else {
                alert("Usuario o clave incorrectos");
            }
        })
        .catch(err => {
            console.error("Error login:", err);
            alert("Error al conectar con el servidor");
        });

        
}

