using Audiomusica.Domain.Assets;
using Audiomusica.Domain.People;
using Audiomusica.Domain.Sap;
using Microsoft.EntityFrameworkCore;

namespace Audiomusica.Infrastructure.Persistence;

public class AssetManagementDbContext : DbContext
{
    public AssetManagementDbContext(DbContextOptions<AssetManagementDbContext> options)
        : base(options)
    {
    }

    public DbSet<Activo> Activos => Set<Activo>();
    public DbSet<Marca> Marcas => Set<Marca>();
    public DbSet<Modelo> Modelos => Set<Modelo>();
    public DbSet<Persona> Personas => Set<Persona>();
    public DbSet<SapActivoMirror> SapActivosMirror => Set<SapActivoMirror>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssetManagementDbContext).Assembly);
    }
}
