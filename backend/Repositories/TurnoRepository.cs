using backend.Data;
using backend.Domain;

namespace backend.Repositories
{
    public class TurnoRepository : ITurnoRepository
    {
        private readonly AppDbContext _context;

        public TurnoRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Turno> ObtenerTodos()
        {
            return _context.Turnos.ToList();
        }

        public Turno Agregar(Turno turno)
        {
            _context.Turnos.Add(turno);
            _context.SaveChanges();
            return turno;
        }
    }
}