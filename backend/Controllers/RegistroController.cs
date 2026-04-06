using Microsoft.AspNetCore.Mvc;
using backend.Domain;
using backend.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroController : ControllerBase
    {
        private readonly IOrdenRepository _repo;
        private readonly IRegistroEntradaRepository _registroEntradaRepo;
        private readonly IRegistroSalidaRepository _registroSalidaRepo;
        private readonly IVehiculoRepository _vehiculoRepo;
        private readonly ITurnoRepository _turnoRepo;
        private readonly IConductorRepository _conductorRepo;

        public RegistroController(IOrdenRepository repo, IRegistroEntradaRepository registroEntradaRepo, IRegistroSalidaRepository registroSalidaRepo, IVehiculoRepository vehiculoRepo, ITurnoRepository turnoRepo, IConductorRepository conductorRepo)
        {
            _repo = repo;
            _registroEntradaRepo = registroEntradaRepo;
            _registroSalidaRepo = registroSalidaRepo;
            _vehiculoRepo = vehiculoRepo;
            _turnoRepo = turnoRepo;
            _conductorRepo = conductorRepo;
        }

        [HttpGet("historial")]
        public IActionResult GetHistorial()
        {
            var registrosEntrada = _registroEntradaRepo.ObtenerTodos();
            var registrosSalida = _registroSalidaRepo.ObtenerTodos();
            var turnos = _turnoRepo.ObtenerTodos();
            var conductores = _conductorRepo.ObtenerTodos();

            var resultado = ObtenerRegistrosConDetalles(registrosEntrada, registrosSalida, turnos, conductores);

            return Ok(resultado);
        }

        [HttpGet("atrasos")]
        public IActionResult GetAtrasos()
        {
            var ordenes = _repo.ObtenerTodos();
            var registrosEntrada = _registroEntradaRepo.ObtenerTodos();
            var registrosSalida = _registroSalidaRepo.ObtenerTodos();
            var turnos = _turnoRepo.ObtenerTodos();
            var conductores = _conductorRepo.ObtenerTodos();

            var resultado = ObtenerRegistrosConHoras(registrosEntrada, registrosSalida, ordenes, turnos, conductores);
            return Ok(resultado);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Orden orden)
        {
            try
            {
                if (orden == null)
                {
                    return BadRequest("La orden es requerida");
                }

                var ordenAgregada = _repo.Agregar(orden);
                if (ordenAgregada == null)
                {
                    return BadRequest("No se pudo agregar la orden");
                }

                return Ok("Orden agregada correctamente");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        private object ObtenerRegistrosConDetalles(List<RegistroEntrada> registrosEntrada, List<RegistroSalida> registrosSalida, List<Turno> turnos, List<Conductor> conductores)
        {
            var entradas = registrosEntrada
                .Select(r => new
                {
                    Patente = r.Patente,
                    Fecha = r.Fecha,
                    Hora = r.Hora,
                    Conductor = new Vehiculo { Patente = r.Patente }.GetConductorNombre(turnos, conductores)
                });

            var salidas = registrosSalida
                .Select(r => new
                {
                    Patente = r.Patente,
                    Fecha = r.Fecha,
                    Hora = r.Hora,
                    Conductor = new Vehiculo { Patente = r.Patente }.GetConductorNombre(turnos, conductores)
                });

            return new
            {
                Entradas = entradas.ToList(),
                Salidas = salidas.ToList()
            };
        }

        private object ObtenerRegistrosConHoras(List<RegistroEntrada> registrosEntrada, List<RegistroSalida> registrosSalida, List<Orden> ordenes, List<Turno> turnos, List<Conductor> conductores)
        {
            var registro = ordenes.Select(o =>
            {
                var entrada = registrosEntrada.FirstOrDefault(e => e.Id_Entrada == o.Id_Entrada);
                var salida = registrosSalida.FirstOrDefault(s => s.Id_Salida == o.Id_Salida);
                var patente = entrada?.Patente ?? salida?.Patente;
                var fecha = entrada?.Fecha ?? salida?.Fecha;

                return new
                {
                    Patente = patente,
                    Fecha = fecha,
                    Horas_Tardadas = o.Horas_Totales,
                    Hora_Salida = salida?.Hora
                };
            }).ToList();

            var detalles = ordenes.Select(o =>
            {
                var entrada = registrosEntrada.FirstOrDefault(e => e.Id_Entrada == o.Id_Entrada);
                var salida = registrosSalida.FirstOrDefault(s => s.Id_Salida == o.Id_Salida);
                var patente = entrada?.Patente ?? salida?.Patente;
                var conductor = new Vehiculo { Patente = patente }.GetConductorNombre(turnos, conductores);

                return new
                {
                    Patente = patente,
                    Fecha = entrada?.Fecha ?? salida?.Fecha,
                    Hora_Entrada = entrada?.Hora,
                    Hora_Salida = salida?.Hora,
                    Conductor = conductor
                };
            }).ToList();

            return new
            {
                Registro = registro,
                Detalles = detalles
            };
        }
    }


}
