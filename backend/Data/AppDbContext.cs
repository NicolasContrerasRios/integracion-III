using Microsoft.EntityFrameworkCore;
using backend.Domain;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<Vehiculo> Vehiculos { get; set; }
        /* .Add()
        .ToList()
        .Find()
        .Remove()*/
        public DbSet<Turno> Turnos { get; set; }

        public DbSet<Conductor> Conductores { get; set; }
        
        public DbSet<RegistroEntrada> RegistroEntradas { get; set; }

        public DbSet<RegistroSalida> RegistroSalidas { get; set; }

        public DbSet<Orden> Ordenes { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vehiculo>().ToTable("Vehiculo");
            modelBuilder.Entity<Turno>().ToTable("Turnos");
            modelBuilder.Entity<Conductor>().ToTable("Conductor");
            modelBuilder.Entity<RegistroEntrada>().ToTable("Registro_Entrada");
            modelBuilder.Entity<RegistroSalida>().ToTable("Registro_Salida");
            modelBuilder.Entity<Orden>().ToTable("Ordenes");
            modelBuilder.Entity<Usuario>().ToTable("Usuario");

        }
    }
}