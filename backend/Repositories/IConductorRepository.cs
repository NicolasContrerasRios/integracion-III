using backend.Domain;

namespace backend.Repositories
{
    public interface IConductorRepository
    {
        List<Conductor> ObtenerTodos();
        Conductor Agregar(Conductor conductor);
    }
    
}