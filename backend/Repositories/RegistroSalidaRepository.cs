using backend.Data;
using backend.Domain;

namespace backend.Repositories
{
    public class RegistroSalidaRepository : IRegistroSalidaRepository
    {
        private readonly AppDbContext _context;

        public RegistroSalidaRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<RegistroSalida> ObtenerTodos()
        {
            return _context.RegistroSalidas.ToList();
        }

        public RegistroSalida Agregar(RegistroSalida registro)
        {
            _context.RegistroSalidas.Add(registro);
            _context.SaveChanges();
            return registro;
        }
    }
}