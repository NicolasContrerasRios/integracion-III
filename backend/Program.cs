using backend.Repositories;
using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IVehiculoRepository, VehiculoRepository>();
builder.Services.AddScoped<ITurnoRepository, TurnoRepository>();
builder.Services.AddScoped<IConductorRepository, ConductorRepository>();
builder.Services.AddScoped<IRegistroEntradaRepository, RegistroEntradaRepository>();
builder.Services.AddScoped<IRegistroSalidaRepository, RegistroSalidaRepository>();

builder.Services.AddOpenApi();
builder.Services.AddControllers();







var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};


app.Run();

