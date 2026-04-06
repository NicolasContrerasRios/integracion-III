using backend.Domain;

namespace backend.Repositories
{
    public interface IOrdenRepository
    {
        List<Orden> ObtenerTodos();
        Orden Agregar(Orden orden);
    }
    
}