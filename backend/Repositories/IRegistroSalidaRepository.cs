using backend.Domain;

namespace backend.Repositories
{
    public interface IRegistroSalidaRepository
    {
        List<RegistroSalida> ObtenerTodos();
        RegistroSalida Agregar(RegistroSalida registro);
    }
    
}