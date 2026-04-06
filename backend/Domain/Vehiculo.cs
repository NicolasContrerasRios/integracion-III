using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;



namespace backend.Domain
{
    public class Vehiculo
    {
        [Key]
        public string Patente { get; set; }

        public string Nombre { get; set; }
        public string Estado { get; set; }

        public string GetConductorNombre(List<Turno> turnos, List<Conductor> conductores)
        {
            var turno = turnos.Where(t => t.Patente == this.Patente).OrderByDescending(t => t.Fecha).FirstOrDefault();
            if (turno == null) return null;
            var conductor = conductores.FirstOrDefault(c => c.Rut == turno.Rut);
            return conductor?.Nombre;
        }

        public DateOnly? ObtenerUltimaFecha(List<RegistroEntrada> entradas, List<RegistroSalida> salidas)
        {
            var ultimoRegistro = entradas
                .Where(r => r.Patente == this.Patente)
                .Select(r => new { Fecha = r.Fecha, Hora = r.Hora, FechaHora = r.Fecha.ToDateTime(r.Hora) })
                .Concat(salidas
                    .Where(r => r.Patente == this.Patente)
                    .Select(r => new { Fecha = r.Fecha, Hora = r.Hora, FechaHora = r.Fecha.ToDateTime(r.Hora) }))
                .OrderByDescending(r => r.FechaHora)
                .FirstOrDefault();

            return ultimoRegistro?.Fecha;
        }

        public TimeOnly? ObtenerUltimaHora(List<RegistroEntrada> entradas, List<RegistroSalida> salidas)
        {
            var ultimoRegistro = entradas
                .Where(r => r.Patente == this.Patente)
                .Select(r => new { Fecha = r.Fecha, Hora = r.Hora, FechaHora = r.Fecha.ToDateTime(r.Hora) })
                .Concat(salidas
                    .Where(r => r.Patente == this.Patente)
                    .Select(r => new { Fecha = r.Fecha, Hora = r.Hora, FechaHora = r.Fecha.ToDateTime(r.Hora) }))
                .OrderByDescending(r => r.FechaHora)
                .FirstOrDefault();

            return ultimoRegistro?.Hora;
        }
        
    }
}