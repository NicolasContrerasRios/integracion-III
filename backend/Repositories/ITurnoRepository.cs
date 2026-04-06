using backend.Domain;

namespace backend.Repositories
{
    public interface ITurnoRepository
    {
        List<Turno> ObtenerTodos();
        Turno Agregar(Turno turno);
    }
    
}