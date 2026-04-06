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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vehiculo>().ToTable("Vehiculo");
        }
    }
}