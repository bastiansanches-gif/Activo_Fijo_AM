using Audiomusica.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Audiomusica.Infrastructure.Persistence;

public class AssetManagementDbContext : DbContext
{
    public AssetManagementDbContext(DbContextOptions<AssetManagementDbContext> options) : base(options)
    {
    }

    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Dimension> Dimensiones => Set<Dimension>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cuenta> Cuentas => Set<Cuenta>();
    public DbSet<UsuarioCuenta> UsuarioCuentas => Set<UsuarioCuenta>();
    public DbSet<Marca> Marcas => Set<Marca>();
    public DbSet<Modelo> Modelos => Set<Modelo>();
    public DbSet<Procesador> Procesadores => Set<Procesador>();
    public DbSet<DiscoDuro> DiscosDuros => Set<DiscoDuro>();
    public DbSet<EstadoActivo> EstadosActivo => Set<EstadoActivo>();
    public DbSet<ActivoFijo> ActivosFijos => Set<ActivoFijo>();
    public DbSet<MovimientoActivoFijo> MovimientosActivoFijo => Set<MovimientoActivoFijo>();
    public DbSet<Checklist> Checklists => Set<Checklist>();
    public DbSet<Herramienta> Herramientas => Set<Herramienta>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Modelo oficial contable/operacional expuesto por la Web API.
        modelBuilder.Entity<Rol>().HasKey(x => x.IdRol);
        modelBuilder.Entity<Dimension>().HasKey(x => x.IdDimension);
        modelBuilder.Entity<Usuario>().HasKey(x => x.IdUsuario);
        modelBuilder.Entity<Cuenta>().HasKey(x => x.IdCuenta);
        modelBuilder.Entity<UsuarioCuenta>().HasKey(x => x.IdUsuarioCuenta);
        modelBuilder.Entity<Marca>().HasKey(x => x.IdMarca);
        modelBuilder.Entity<Modelo>().HasKey(x => x.IdModelo);
        modelBuilder.Entity<Procesador>().HasKey(x => x.IdProcesador);
        modelBuilder.Entity<DiscoDuro>().HasKey(x => x.IdDiscoDuro);
        modelBuilder.Entity<EstadoActivo>().HasKey(x => x.IdEstadoActivo);
        modelBuilder.Entity<ActivoFijo>().HasKey(x => x.IdActivoFijo);
        modelBuilder.Entity<MovimientoActivoFijo>().HasKey(x => x.IdMovimiento);
        modelBuilder.Entity<Checklist>().HasKey(x => x.IdChecklist);
        modelBuilder.Entity<Herramienta>().HasKey(x => x.IdHerramienta);

        modelBuilder.Entity<Rol>().ToTable("Roles");
        modelBuilder.Entity<Dimension>().ToTable("Dimensiones");
        modelBuilder.Entity<Usuario>().ToTable("Usuarios");
        modelBuilder.Entity<Cuenta>().ToTable("Cuentas");
        modelBuilder.Entity<UsuarioCuenta>().ToTable("UsuarioCuentas");
        modelBuilder.Entity<Marca>().ToTable("Marcas");
        modelBuilder.Entity<Modelo>().ToTable("Modelos");
        modelBuilder.Entity<Procesador>().ToTable("Procesadores");
        modelBuilder.Entity<DiscoDuro>().ToTable("DiscosDuros");
        modelBuilder.Entity<EstadoActivo>().ToTable("EstadosActivo");
        modelBuilder.Entity<ActivoFijo>().ToTable("ActivoFijo");
        modelBuilder.Entity<MovimientoActivoFijo>().ToTable("MovimientosActivoFijo");
        modelBuilder.Entity<Checklist>().ToTable("Checklist");
        modelBuilder.Entity<Herramienta>().ToTable("Herramientas");

        modelBuilder.Entity<ActivoFijo>().HasIndex(x => x.Serial).IsUnique();
        modelBuilder.Entity<Usuario>().HasIndex(x => x.Rut).IsUnique();
        modelBuilder.Entity<Modelo>().HasOne(x => x.Marca).WithMany().HasForeignKey(x => x.IdMarca).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Usuario>().HasOne(x => x.Rol).WithMany().HasForeignKey(x => x.IdRol).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Usuario>().HasOne(x => x.Dimension).WithMany().HasForeignKey(x => x.IdDimension).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<UsuarioCuenta>().HasOne(x => x.Usuario).WithMany(x => x.UsuarioCuentas).HasForeignKey(x => x.IdUsuario).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<UsuarioCuenta>().HasOne(x => x.Cuenta).WithMany().HasForeignKey(x => x.IdCuenta).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<UsuarioCuenta>().HasIndex(x => new { x.IdUsuario, x.IdCuenta }).IsUnique();
        modelBuilder.Entity<ActivoFijo>().HasOne(x => x.Dimension).WithMany().HasForeignKey(x => x.IdDimension).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ActivoFijo>().HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.IdUsuario).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<ActivoFijo>().HasOne(x => x.Marca).WithMany().HasForeignKey(x => x.IdMarca).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ActivoFijo>().HasOne(x => x.Modelo).WithMany().HasForeignKey(x => x.IdModelo).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ActivoFijo>().HasOne(x => x.Procesador).WithMany().HasForeignKey(x => x.IdProcesador).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<ActivoFijo>().HasOne(x => x.DiscoDuro).WithMany().HasForeignKey(x => x.IdDiscoDuro).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<ActivoFijo>().HasOne(x => x.EstadoActivo).WithMany().HasForeignKey(x => x.IdEstadoActivo).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Herramienta>().HasOne(x => x.Dimension).WithMany().HasForeignKey(x => x.IdDimension).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<MovimientoActivoFijo>().HasOne(x => x.ActivoFijo).WithMany().HasForeignKey(x => x.IdActivoFijo).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Dimension>().HasIndex(x => x.NumeroDimension).IsUnique();
        modelBuilder.Entity<Cuenta>().HasIndex(x => x.NombreCuenta).IsUnique();

        Seed(modelBuilder);
    }

    private static void Seed(ModelBuilder modelBuilder)
    {
        // Dimensiones no se cargan por seed; seran sincronizadas desde SAP HANA.
        modelBuilder.Entity<Rol>().HasData(new Rol { IdRol = 1, NombreRol = "Admin" }, new Rol { IdRol = 2, NombreRol = "Normal" });
        modelBuilder.Entity<Cuenta>().HasData(
            new Cuenta { IdCuenta = 1, NombreCuenta = "Office" },
            new Cuenta { IdCuenta = 2, NombreCuenta = "Microsoft" },
            new Cuenta { IdCuenta = 3, NombreCuenta = "Adobe" },
            new Cuenta { IdCuenta = 4, NombreCuenta = "SAP" },
            new Cuenta { IdCuenta = 5, NombreCuenta = "TPV" },
            new Cuenta { IdCuenta = 6, NombreCuenta = "Google (Correo)" },
            new Cuenta { IdCuenta = 7, NombreCuenta = "Apple ID" },
            new Cuenta { IdCuenta = 8, NombreCuenta = "AutoCAD" },
            new Cuenta { IdCuenta = 9, NombreCuenta = "Active Directory" },
            new Cuenta { IdCuenta = 10, NombreCuenta = "VPN" },
            new Cuenta { IdCuenta = 11, NombreCuenta = "Retail Pro" },
            new Cuenta { IdCuenta = 12, NombreCuenta = "Fecele" });
        modelBuilder.Entity<Marca>().HasData(
            new Marca { IdMarca = 1, NombreMarca = "HP" },
            new Marca { IdMarca = 2, NombreMarca = "Lenovo" },
            new Marca { IdMarca = 3, NombreMarca = "Dell" },
            new Marca { IdMarca = 4, NombreMarca = "Apple" },
            new Marca { IdMarca = 5, NombreMarca = "Ubiquiti" },
            new Marca { IdMarca = 6, NombreMarca = "Brother" });
        modelBuilder.Entity<Modelo>().HasData(
            new Modelo { IdModelo = 1, IdMarca = 1, NombreModelo = "ProBook 440" },
            new Modelo { IdModelo = 2, IdMarca = 2, NombreModelo = "ThinkPad" },
            new Modelo { IdModelo = 3, IdMarca = 3, NombreModelo = "Latitude" },
            new Modelo { IdModelo = 4, IdMarca = 4, NombreModelo = "MacBook Pro" },
            new Modelo { IdModelo = 5, IdMarca = 4, NombreModelo = "iMac" },
            new Modelo { IdModelo = 6, IdMarca = 5, NombreModelo = "UniFi AP" });
        modelBuilder.Entity<Procesador>().HasData(
            new Procesador { IdProcesador = 1, NombreProcesador = "Intel Core i5" },
            new Procesador { IdProcesador = 2, NombreProcesador = "Intel Core i7" },
            new Procesador { IdProcesador = 3, NombreProcesador = "AMD Ryzen 5" },
            new Procesador { IdProcesador = 4, NombreProcesador = "Apple M1" },
            new Procesador { IdProcesador = 5, NombreProcesador = "Apple M2" });
        modelBuilder.Entity<DiscoDuro>().HasData(
            new DiscoDuro { IdDiscoDuro = 1, TipoDisco = "SSD", CapacidadGB = 256, Descripcion = "SSD 256GB" },
            new DiscoDuro { IdDiscoDuro = 2, TipoDisco = "SSD", CapacidadGB = 512, Descripcion = "SSD 512GB" },
            new DiscoDuro { IdDiscoDuro = 3, TipoDisco = "SSD", CapacidadGB = 1024, Descripcion = "SSD 1TB" },
            new DiscoDuro { IdDiscoDuro = 4, TipoDisco = "HDD", CapacidadGB = 1024, Descripcion = "HDD 1TB" },
            new DiscoDuro { IdDiscoDuro = 5, TipoDisco = "NVMe", CapacidadGB = 512, Descripcion = "NVMe 512GB" });
        modelBuilder.Entity<EstadoActivo>().HasData(
            new EstadoActivo { IdEstadoActivo = 1, NombreEstado = "Disponible" },
            new EstadoActivo { IdEstadoActivo = 2, NombreEstado = "Asignado" },
            new EstadoActivo { IdEstadoActivo = 3, NombreEstado = "En reparacion" },
            new EstadoActivo { IdEstadoActivo = 4, NombreEstado = "Dado de baja" },
            new EstadoActivo { IdEstadoActivo = 5, NombreEstado = "Perdido" });
        modelBuilder.Entity<Herramienta>().HasData(
            new Herramienta { IdHerramienta = 1, NombreHerramienta = "Martillo", TipoHerramienta = "Manual", Cantidad = 3, IdDimension = null, Estado = "Disponible", FechaRegistro = new DateTime(2026, 1, 1), Activo = true },
            new Herramienta { IdHerramienta = 2, NombreHerramienta = "Taladro", TipoHerramienta = "Electrica", Marca = "Bosch", Cantidad = 1, IdDimension = null, Estado = "Disponible", FechaRegistro = new DateTime(2026, 1, 1), Activo = true });
        modelBuilder.Entity<Checklist>().HasData(
            new Checklist { IdChecklist = 1, NombreChecklist = "Checklist Entrega Administrativos", TipoChecklist = "Entrega", NombreArchivo = "checklist-entrega-administrativos.txt", RutaArchivo = "Storage/Checklists/checklist-entrega-administrativos.txt", ExtensionArchivo = ".txt", FechaCreacion = new DateTime(2026, 1, 1) },
            new Checklist { IdChecklist = 2, NombreChecklist = "Checklist Devolucion Equipo", TipoChecklist = "Devolucion", NombreArchivo = "checklist-devolucion-equipo.txt", RutaArchivo = "Storage/Checklists/checklist-devolucion-equipo.txt", ExtensionArchivo = ".txt", FechaCreacion = new DateTime(2026, 1, 1) },
            new Checklist { IdChecklist = 3, NombreChecklist = "Checklist Toma Activo Fijo", TipoChecklist = "Toma", NombreArchivo = "checklist-toma-activo-fijo.txt", RutaArchivo = "Storage/Checklists/checklist-toma-activo-fijo.txt", ExtensionArchivo = ".txt", FechaCreacion = new DateTime(2026, 1, 1) });
    }
}
