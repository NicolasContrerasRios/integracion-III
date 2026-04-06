
using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class RegistroEntrada
    {
        [Key]
        public int Id_Entrada { get; set; }

        public string Patente { get; set; }

        public TimeOnly Hora { get; set; }
        public DateOnly Fecha { get; set; }
        
    }
}