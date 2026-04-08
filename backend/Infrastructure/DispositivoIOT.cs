using System;

namespace backend.Infrastructure
{
    public class DispositivoIOT
    {
        public string Patente { get; set; }
        public DateOnly Fecha { get; set; }
        public TimeOnly Hora { get; set; }
        public string TipoRegistro { get; set; }

        public string ObtenerTipoRegistro()
        {
            if (string.Equals(TipoRegistro, "entrada", StringComparison.OrdinalIgnoreCase))
            {
                return "entrada";
            }

            if (string.Equals(TipoRegistro, "salida", StringComparison.OrdinalIgnoreCase))
            {
                return "salida";
            }

            return "desconocido";
        }
    }
}
