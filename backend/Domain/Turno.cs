using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class Turno
    {
        [Key]
        public int Id_Turnos { get; set; }

        public string Patente { get; set; }
        public string Rut { get; set; }
        public DateOnly Fecha { get; set; }

    }
}