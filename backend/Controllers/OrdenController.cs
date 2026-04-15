using Microsoft.AspNetCore.Mvc;
using backend.Domain;
using backend.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenController : ControllerBase
    {
        private readonly IOrdenRepository _orderRepo;
        private readonly IRegistroEntradaRepository _registroEntradaRepo;

        public OrdenController(IOrdenRepository orderRepository, IRegistroEntradaRepository registroEntradaRepo)
        {
            _orderRepo = orderRepository;
            _registroEntradaRepo = registroEntradaRepo;

        }

        [HttpGet]
        public IActionResult Get()
        {
            var ordenes = _orderRepo.ObtenerTodos();
            var registrosEntrada = _registroEntradaRepo.ObtenerTodos();

            return Ok(ObtenerOrdenesConFechas(ordenes, registrosEntrada));
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

                var ordenAgregada = _orderRepo.Agregar(orden);
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

        private DateOnly? ObtenerFechaEntrada(Orden orden, List<RegistroEntrada> registrosEntrada)
        {
            var registro = registrosEntrada.FirstOrDefault(r => r.Id_Entrada == orden.Id_Entrada);
            return registro?.Fecha;
        }

        private IEnumerable<object> ObtenerOrdenesConFechas(List<Orden> ordenes, List<RegistroEntrada> registrosEntrada)
        {
            var result = ordenes.Select(o => new
            {
                o.Id,
                FechaEntrada = ObtenerFechaEntrada(o, registrosEntrada)
            }).ToList();

            return result;
        }
    }


}
