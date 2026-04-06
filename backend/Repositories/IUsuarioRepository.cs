using backend.Domain;

namespace backend.Repositories
{
    public interface IUsuarioRepository
    {
        List<Usuario> ObtenerTodos();
        Usuario Agregar(Usuario usuario);

        Usuario ObtenerPorNombre(string nombre);
    }
    
}