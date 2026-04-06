using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class Vehiculo
    {
        [Key]
        public string patente { get; set; }

        public string Nombre { get; set; }
        public string estado { get; set; }


    }
}