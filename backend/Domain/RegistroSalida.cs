using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class RegistroSalida
    {
        [Key]
        public int Id_Salida { get; set; }

        public string Patente { get; set; }

        public TimeOnly Hora { get; set; }
        public DateOnly Fecha { get; set; }
        
    }
}