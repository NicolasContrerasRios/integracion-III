using backend.Data;
using backend.Domain;

namespace backend.Repositories
{
    public class VehiculoRepository : IVehiculoRepository
    {
        private readonly AppDbContext _context;

        public VehiculoRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Vehiculo> ObtenerTodos()
        {
            return _context.Vehiculos.ToList();
        }

        public Vehiculo Agregar(Vehiculo vehiculo)
        {
            _context.Vehiculos.Add(vehiculo);
            _context.SaveChanges();
            return vehiculo;
        }
        public Vehiculo Modificar(Vehiculo vehiculo)
        {
            var vehiculoExistente = _context.Vehiculos.FirstOrDefault(v => v.Patente == vehiculo.Patente);
            if (vehiculoExistente == null)
            {
                return null;
            }

            vehiculoExistente.Nombre = vehiculo.Nombre;
            vehiculoExistente.Estado = vehiculo.Estado;

            _context.SaveChanges();
            return vehiculoExistente;
        }
    }
}