using backend.Domain;

namespace backend.Repositories
{
    public interface IRegistroEntradaRepository
    {
        List<RegistroEntrada> ObtenerTodos();
        RegistroEntrada Agregar(RegistroEntrada registro);
    }
    
}