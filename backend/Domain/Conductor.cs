using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class Conductor
    {
        [Key]
        public string Rut { get; set; }

        public string Nombre { get; set; }


    }
}