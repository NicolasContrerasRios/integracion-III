using Microsoft.AspNetCore.Mvc;
using backend.Domain;
using backend.Repositories;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiculoController : ControllerBase
    {
        private readonly IVehiculoRepository _repo;

        public VehiculoController(IVehiculoRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_repo.ObtenerTodos());
        }

        [HttpPost]
        public IActionResult Post([FromBody] Vehiculo vehiculo)
        {
            return Ok(_repo.Agregar(vehiculo));
        }
    }
}