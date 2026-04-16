using Microsoft.AspNetCore.Mvc;
using backend.Domain;
using backend.Infrastructure;
using backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroController : ControllerBase
    {
        private readonly IOrdenRepository _ordenRepo;

        private readonly IVehiculoRepository _vehiculoRepo;
        private readonly IRegistroEntradaRepository _registroEntradaRepo;
        private readonly IRegistroSalidaRepository _registroSalidaRepo;
        private readonly ITurnoRepository _turnoRepo;
        private readonly IConductorRepository _conductorRepo;

        public RegistroController(IOrdenRepository ordenRepo, IVehiculoRepository vehiculoRepo, IRegistroEntradaRepository registroEntradaRepo, IRegistroSalidaRepository registroSalidaRepo, ITurnoRepository turnoRepo, IConductorRepository conductorRepo)
        {
            _ordenRepo = ordenRepo;
            _vehiculoRepo = vehiculoRepo;
            _registroEntradaRepo = registroEntradaRepo;
            _registroSalidaRepo = registroSalidaRepo;
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
            var ordenes = _ordenRepo.ObtenerTodos();
            var registrosEntrada = _registroEntradaRepo.ObtenerTodos();
            var registrosSalida = _registroSalidaRepo.ObtenerTodos();
            var turnos = _turnoRepo.ObtenerTodos();
            var conductores = _conductorRepo.ObtenerTodos();

            var ordenesConAtraso = ordenes.Where(o => o.EsAtraso(o.Horas_Totales)).ToList();
            var resultado = ObtenerRegistrosConAtrasos(registrosEntrada, registrosSalida, ordenesConAtraso, turnos, conductores);

            return Ok(resultado);
        }
        
        [HttpPost]
        public IActionResult PostIOT([FromBody] DispositivoIOT dispositivo)
        {
            if (dispositivo == null)
            {
                return BadRequest(new { mensaje = "Datos del dispositivo no pueden ser nulos." });
            }

            // Verificar estado del vehículo
            var vehiculo = _vehiculoRepo.ObtenerTodos().FirstOrDefault(v => v.Patente == dispositivo.Patente);
            if (vehiculo != null && vehiculo.Estado == "Fuera de servicio")
            {
                return BadRequest(new { mensaje = "El vehículo está fuera de servicio y no puede registrar entrada ni salida." });
            }

            var tipo = dispositivo.ObtenerTipoRegistro();
            var ordenes = _ordenRepo.ObtenerTodos();


            if (tipo == "entrada")
            {
                var entrada = new RegistroEntrada
                {
                    Patente = dispositivo.Patente,
                    Fecha = dispositivo.Fecha,
                    Hora = dispositivo.Hora
                };

                var entradaGuardada = _registroEntradaRepo.Agregar(entrada);
                
                // Actualizar estado del vehículo a "Disponible"
                if (vehiculo != null)
                {
                    vehiculo.Estado = "Disponible";
                    _vehiculoRepo.Modificar(vehiculo);
                }
                
                var salidas = _registroSalidaRepo.ObtenerTodos();

                if (ObtenerSalidaAnteriorSinOrden(dispositivo.Patente, salidas, ordenes, out var salidaNoRegistrada) && salidaNoRegistrada != null)
                {
                    var orden = new Orden
                    {
                        Id_Entrada = entradaGuardada.Id_Entrada,
                        Id_Salida = salidaNoRegistrada.Id_Salida,
                        Horas_Totales = Orden.CalcularDiferenciaHoras(salidaNoRegistrada.Hora, entradaGuardada.Hora)
                    };

                    var ordenGuardada = _ordenRepo.Agregar(orden);
                    return Ok(new
                    {
                        mensaje = "Entrada registrada y orden creada.",
                        entrada = entradaGuardada,
                        salida = salidaNoRegistrada,
                        orden = ordenGuardada
                    });
                }

                return Ok(new
                {
                    mensaje = "Entrada registrada.",
                    entrada = entradaGuardada
                });
            }

            if (tipo == "salida")
            {
                /*if (!VerificarRangoHora(TimeOnly.Parse(dispositivo.Hora.ToString("HH:mm:ss"))))
                {
                    return BadRequest(new { mensaje = "La hora de salida está fuera del rango permitido (08:00 - 18:00)." });
                } */

                var salida = new RegistroSalida
                {
                    Patente = dispositivo.Patente,
                    Fecha = dispositivo.Fecha,
                    Hora = dispositivo.Hora
                };

                var salidaGuardada = _registroSalidaRepo.Agregar(salida);
                
                // Actualizar estado del vehículo a "En transito"
                if (vehiculo != null)
                {
                    vehiculo.Estado = "En transito";
                    _vehiculoRepo.Modificar(vehiculo);
                }
                
                return Ok(new
                {
                    mensaje = "Salida registrada.",
                    salida = salidaGuardada
                });
            }

            return BadRequest(new { mensaje = "Tipo de registro inválido. Use 'entrada' o 'salida'." });
        }

        private bool ObtenerSalidaAnteriorSinOrden(string patente, List<RegistroSalida> salidas, List<Orden> ordenes, out RegistroSalida? salidaNoRegistrada)
        {
            var salidasEnOrden = ordenes.Select(o => o.Id_Salida).ToHashSet();
            salidaNoRegistrada = salidas
                .Where(s => s.Patente == patente && !salidasEnOrden.Contains(s.Id_Salida))
                .OrderByDescending(s => s.Fecha.ToDateTime(s.Hora))
                .FirstOrDefault();

            return salidaNoRegistrada != null;
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

        private object ObtenerRegistrosConAtrasos(List<RegistroEntrada> registrosEntrada, List<RegistroSalida> registrosSalida, List<Orden> ordenes, List<Turno> turnos, List<Conductor> conductores)
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
                var conductor = !string.IsNullOrEmpty(patente) ? new Vehiculo { Patente = patente }.GetConductorNombre(turnos, conductores) : null;

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

        private bool VerificarRangoHora(TimeOnly hora)
        {
            var inicio = TimeOnly.Parse("08:00");
            var fin = TimeOnly.Parse("18:00");
            return hora >= inicio && hora <= fin;
        }
    }


}
