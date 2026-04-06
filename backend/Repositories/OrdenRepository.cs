using backend.Data;
using backend.Domain;

namespace backend.Repositories
{
    public class OrdenRepository : IOrdenRepository
    {
        private readonly AppDbContext _context;

        public OrdenRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Orden> ObtenerTodos()
        {
            return _context.Ordenes.ToList();
        }

        public Orden Agregar(Orden orden)
        {
            _context.Ordenes.Add(orden);
            _context.SaveChanges();
            return orden;
        }
    }
}