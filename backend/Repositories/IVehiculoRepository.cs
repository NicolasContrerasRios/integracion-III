using backend.Domain;

namespace backend.Repositories
{
    public interface IVehiculoRepository
    {
        List<Vehiculo> ObtenerTodos();
        Vehiculo Agregar(Vehiculo vehiculo);
    }
    
}