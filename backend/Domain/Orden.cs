using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class Orden
    {
        [Key]
        public int Id { get; set; }

        public int Id_Entrada { get; set; }
        public int Id_Salida { get; set; }
        public int Horas_Totales { get; set; }

        public static int CalcularDiferenciaHoras(TimeOnly hora1, TimeOnly hora2)
        {
            var diferencia = hora1 > hora2 ? hora1 - hora2 : hora2 - hora1;
            return (int)diferencia.TotalHours;
        }

        public bool EsAtraso(int hora)
        {
            int horasMaximasTardadas = 6;
            return hora >= horasMaximasTardadas;
        }
    }
}