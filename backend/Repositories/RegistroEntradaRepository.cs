using backend.Data;
using backend.Domain;

namespace backend.Repositories
{
    public class RegistroEntradaRepository : IRegistroEntradaRepository
    {
        private readonly AppDbContext _context;

        public RegistroEntradaRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<RegistroEntrada> ObtenerTodos()
        {
            return _context.RegistroEntradas.ToList();
        }

        public RegistroEntrada Agregar(RegistroEntrada registro)
        {
            _context.RegistroEntradas.Add(registro);
            _context.SaveChanges();
            return registro;
        }
    }
}