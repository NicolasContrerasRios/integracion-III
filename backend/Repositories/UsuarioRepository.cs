using backend.Data;
using backend.Domain;

namespace backend.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Usuario> ObtenerTodos()
        {
            return _context.Usuarios.ToList();
        }

        public Usuario Agregar(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
            return usuario;
        }

        public Usuario ObtenerPorNombre(string nombre)
        {
            return _context.Usuarios.FirstOrDefault(u => u.NombreUsuario == nombre);
        }
    }
}