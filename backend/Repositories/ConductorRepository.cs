using backend.Data;
using backend.Domain;

namespace backend.Repositories
{
    public class ConductorRepository : IConductorRepository
    {
        private readonly AppDbContext _context;

        public ConductorRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Conductor> ObtenerTodos()
        {
            return _context.Conductores.ToList();
        }

        public Conductor Agregar(Conductor conductor)
        {
            _context.Conductores.Add(conductor);
            _context.SaveChanges();
            return conductor;
        }
    }
}