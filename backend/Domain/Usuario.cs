using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class Orden
    {
        [Key]
        public int Id { get; set; }

        public string NombreUsuario { get; set; }
        public string Clave { get; set; }


        
    }
}