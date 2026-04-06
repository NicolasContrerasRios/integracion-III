using Microsoft.AspNetCore.Mvc;
using backend.Domain;
using backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutentificationController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepo;


        public AutentificationController(IUsuarioRepository repo)
        {
            _usuarioRepo = repo;
            
        }

        [HttpGet]
        public IActionResult Get()
        {
           

            return Ok();
        }

        [HttpPost]
        public IActionResult Post([FromBody] Orden orden)
        {
            return Ok();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario login)
        {
            var usuario = _usuarioRepo.ObtenerPorNombre(login.NombreUsuario);

            if (usuario == null)
                return Unauthorized();


            if (usuario.Clave == login.Clave)
            {
                return Ok("Login correcto");
            }

            return Unauthorized();
        }
        
    }
}