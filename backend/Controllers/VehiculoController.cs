using Microsoft.AspNetCore.Mvc;
using backend.Domain;
using backend.Repositories;
using Microsoft.VisualBasic;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiculoController : ControllerBase
    {
        private readonly IVehiculoRepository _repo;
        private readonly ITurnoRepository _turnoRepo;
        private readonly IConductorRepository _conductorRepo;
        private readonly IRegistroEntradaRepository _registroEntradaRepo;
        private readonly IRegistroSalidaRepository _registroSalidaRepo;

        public VehiculoController(IVehiculoRepository repo, ITurnoRepository turnoRepo, IConductorRepository conductorRepo, IRegistroEntradaRepository registroEntradaRepo, IRegistroSalidaRepository registroSalidaRepo)
        {
            _repo = repo;
            _turnoRepo = turnoRepo;
            _conductorRepo = conductorRepo;
            _registroEntradaRepo = registroEntradaRepo;
            _registroSalidaRepo = registroSalidaRepo;
        }

        [HttpGet]
        public IActionResult Get()
        {
            /*return Ok(_repo.ObtenerTodos());*/
            var vehiculos = _repo.ObtenerTodos();
            var turnos = _turnoRepo.ObtenerTodos();
            var conductores = _conductorRepo.ObtenerTodos();
            var registrosEntrada = _registroEntradaRepo.ObtenerTodos();
            var registrosSalida = _registroSalidaRepo.ObtenerTodos();

            return Ok(GetVehiculosConConductores(vehiculos, turnos, conductores, registrosEntrada, registrosSalida));
        }

        [HttpPost]
        public IActionResult Post([FromBody] VehiculoTurnoRequest request)
        {
            var vehiculo = new Vehiculo
            {
                Patente = request.Patente,
                Nombre = request.NombreVehiculo,
                Estado = "activo"
            };
            _repo.Agregar(vehiculo);

            var conductores = _conductorRepo.ObtenerTodos();
            var conductor = conductores.FirstOrDefault(c => c.Nombre == request.NombreConductor);
            if (conductor == null)
            {
                return BadRequest("Conductor no encontrado");
            }

            var turno = new Turno
            {
                Patente = request.Patente,
                Rut = conductor.Rut,
                Fecha = DateOnly.FromDateTime(DateTime.Now)
            };
            _turnoRepo.Agregar(turno);

            return Ok();
        }

        public class VehiculoTurnoRequest
        {
            public string Patente { get; set; }
            public string NombreVehiculo { get; set; }
            public string NombreConductor { get; set; }
        }

        private IEnumerable<object> GetVehiculosConConductores(List<Vehiculo> vehiculos, List<Turno> turnos, List<Conductor> conductores, List<RegistroEntrada> registrosEntrada, List<RegistroSalida> registrosSalida)
        {
            var result = vehiculos.Select(v => new
            {
                patente = v.Patente,
                nombre = v.Nombre,
                estado = v.Estado,
                conductor = new
                {
                    nombre = v.GetConductorNombre(turnos, conductores)
                },
                fecha = v.ObtenerUltimaFecha(registrosEntrada, registrosSalida),
                hora = v.ObtenerUltimaHora(registrosEntrada, registrosSalida)
                

            }).ToList();
            return result;
        }
    }
}