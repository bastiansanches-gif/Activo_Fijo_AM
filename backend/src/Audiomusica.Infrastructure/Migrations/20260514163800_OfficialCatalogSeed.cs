using Audiomusica.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Audiomusica.Infrastructure.Migrations
{
    [DbContext(typeof(AssetManagementDbContext))]
    [Migration("20260514163800_OfficialCatalogSeed")]
    public partial class OfficialCatalogSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
IF NOT EXISTS (SELECT 1 FROM [Roles] WHERE [IdRol] = 1)
BEGIN
    SET IDENTITY_INSERT [Roles] ON;
    INSERT INTO [Roles] ([IdRol], [NombreRol]) VALUES (1, N'Admin');
    SET IDENTITY_INSERT [Roles] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [Roles] WHERE [IdRol] = 2)
BEGIN
    SET IDENTITY_INSERT [Roles] ON;
    INSERT INTO [Roles] ([IdRol], [NombreRol]) VALUES (2, N'Normal');
    SET IDENTITY_INSERT [Roles] OFF;
END;
""");

            migrationBuilder.Sql("""
SET IDENTITY_INSERT [Cuentas] ON;
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 1) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (1, N'Office');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 2) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (2, N'Microsoft');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 3) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (3, N'Adobe');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 4) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (4, N'SAP');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 5) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (5, N'TPV');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 6) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (6, N'Google (Correo)');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 7) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (7, N'Apple ID');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 8) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (8, N'AutoCAD');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 9) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (9, N'Active Directory');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 10) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (10, N'VPN');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 11) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (11, N'Retail Pro');
IF NOT EXISTS (SELECT 1 FROM [Cuentas] WHERE [IdCuenta] = 12) INSERT INTO [Cuentas] ([IdCuenta], [NombreCuenta]) VALUES (12, N'Fecele');
SET IDENTITY_INSERT [Cuentas] OFF;
""");

            migrationBuilder.Sql("""
SET IDENTITY_INSERT [Marcas] ON;
IF NOT EXISTS (SELECT 1 FROM [Marcas] WHERE [IdMarca] = 1) INSERT INTO [Marcas] ([IdMarca], [NombreMarca]) VALUES (1, N'HP');
IF NOT EXISTS (SELECT 1 FROM [Marcas] WHERE [IdMarca] = 2) INSERT INTO [Marcas] ([IdMarca], [NombreMarca]) VALUES (2, N'Lenovo');
IF NOT EXISTS (SELECT 1 FROM [Marcas] WHERE [IdMarca] = 3) INSERT INTO [Marcas] ([IdMarca], [NombreMarca]) VALUES (3, N'Dell');
IF NOT EXISTS (SELECT 1 FROM [Marcas] WHERE [IdMarca] = 4) INSERT INTO [Marcas] ([IdMarca], [NombreMarca]) VALUES (4, N'Apple');
IF NOT EXISTS (SELECT 1 FROM [Marcas] WHERE [IdMarca] = 5) INSERT INTO [Marcas] ([IdMarca], [NombreMarca]) VALUES (5, N'Ubiquiti');
IF NOT EXISTS (SELECT 1 FROM [Marcas] WHERE [IdMarca] = 6) INSERT INTO [Marcas] ([IdMarca], [NombreMarca]) VALUES (6, N'Brother');
SET IDENTITY_INSERT [Marcas] OFF;
""");

            migrationBuilder.Sql("""
SET IDENTITY_INSERT [Modelos] ON;
IF NOT EXISTS (SELECT 1 FROM [Modelos] WHERE [IdModelo] = 1) INSERT INTO [Modelos] ([IdModelo], [IdMarca], [NombreModelo]) VALUES (1, 1, N'ProBook 440');
IF NOT EXISTS (SELECT 1 FROM [Modelos] WHERE [IdModelo] = 2) INSERT INTO [Modelos] ([IdModelo], [IdMarca], [NombreModelo]) VALUES (2, 2, N'ThinkPad');
IF NOT EXISTS (SELECT 1 FROM [Modelos] WHERE [IdModelo] = 3) INSERT INTO [Modelos] ([IdModelo], [IdMarca], [NombreModelo]) VALUES (3, 3, N'Latitude');
IF NOT EXISTS (SELECT 1 FROM [Modelos] WHERE [IdModelo] = 4) INSERT INTO [Modelos] ([IdModelo], [IdMarca], [NombreModelo]) VALUES (4, 4, N'MacBook Pro');
IF NOT EXISTS (SELECT 1 FROM [Modelos] WHERE [IdModelo] = 5) INSERT INTO [Modelos] ([IdModelo], [IdMarca], [NombreModelo]) VALUES (5, 4, N'iMac');
IF NOT EXISTS (SELECT 1 FROM [Modelos] WHERE [IdModelo] = 6) INSERT INTO [Modelos] ([IdModelo], [IdMarca], [NombreModelo]) VALUES (6, 5, N'UniFi AP');
SET IDENTITY_INSERT [Modelos] OFF;
""");

            migrationBuilder.Sql("""
SET IDENTITY_INSERT [Procesadores] ON;
IF NOT EXISTS (SELECT 1 FROM [Procesadores] WHERE [IdProcesador] = 1) INSERT INTO [Procesadores] ([IdProcesador], [NombreProcesador]) VALUES (1, N'Intel Core i5');
IF NOT EXISTS (SELECT 1 FROM [Procesadores] WHERE [IdProcesador] = 2) INSERT INTO [Procesadores] ([IdProcesador], [NombreProcesador]) VALUES (2, N'Intel Core i7');
IF NOT EXISTS (SELECT 1 FROM [Procesadores] WHERE [IdProcesador] = 3) INSERT INTO [Procesadores] ([IdProcesador], [NombreProcesador]) VALUES (3, N'AMD Ryzen 5');
IF NOT EXISTS (SELECT 1 FROM [Procesadores] WHERE [IdProcesador] = 4) INSERT INTO [Procesadores] ([IdProcesador], [NombreProcesador]) VALUES (4, N'Apple M1');
IF NOT EXISTS (SELECT 1 FROM [Procesadores] WHERE [IdProcesador] = 5) INSERT INTO [Procesadores] ([IdProcesador], [NombreProcesador]) VALUES (5, N'Apple M2');
SET IDENTITY_INSERT [Procesadores] OFF;
""");

            migrationBuilder.Sql("""
SET IDENTITY_INSERT [DiscosDuros] ON;
IF NOT EXISTS (SELECT 1 FROM [DiscosDuros] WHERE [IdDiscoDuro] = 1) INSERT INTO [DiscosDuros] ([IdDiscoDuro], [TipoDisco], [CapacidadGB], [Descripcion]) VALUES (1, N'SSD', 256, N'SSD 256GB');
IF NOT EXISTS (SELECT 1 FROM [DiscosDuros] WHERE [IdDiscoDuro] = 2) INSERT INTO [DiscosDuros] ([IdDiscoDuro], [TipoDisco], [CapacidadGB], [Descripcion]) VALUES (2, N'SSD', 512, N'SSD 512GB');
IF NOT EXISTS (SELECT 1 FROM [DiscosDuros] WHERE [IdDiscoDuro] = 3) INSERT INTO [DiscosDuros] ([IdDiscoDuro], [TipoDisco], [CapacidadGB], [Descripcion]) VALUES (3, N'SSD', 1024, N'SSD 1TB');
IF NOT EXISTS (SELECT 1 FROM [DiscosDuros] WHERE [IdDiscoDuro] = 4) INSERT INTO [DiscosDuros] ([IdDiscoDuro], [TipoDisco], [CapacidadGB], [Descripcion]) VALUES (4, N'HDD', 1024, N'HDD 1TB');
IF NOT EXISTS (SELECT 1 FROM [DiscosDuros] WHERE [IdDiscoDuro] = 5) INSERT INTO [DiscosDuros] ([IdDiscoDuro], [TipoDisco], [CapacidadGB], [Descripcion]) VALUES (5, N'NVMe', 512, N'NVMe 512GB');
SET IDENTITY_INSERT [DiscosDuros] OFF;
""");

            migrationBuilder.Sql("""
SET IDENTITY_INSERT [EstadosActivo] ON;
IF NOT EXISTS (SELECT 1 FROM [EstadosActivo] WHERE [IdEstadoActivo] = 1) INSERT INTO [EstadosActivo] ([IdEstadoActivo], [NombreEstado]) VALUES (1, N'Disponible');
IF NOT EXISTS (SELECT 1 FROM [EstadosActivo] WHERE [IdEstadoActivo] = 2) INSERT INTO [EstadosActivo] ([IdEstadoActivo], [NombreEstado]) VALUES (2, N'Asignado');
IF NOT EXISTS (SELECT 1 FROM [EstadosActivo] WHERE [IdEstadoActivo] = 3) INSERT INTO [EstadosActivo] ([IdEstadoActivo], [NombreEstado]) VALUES (3, N'En reparacion');
IF NOT EXISTS (SELECT 1 FROM [EstadosActivo] WHERE [IdEstadoActivo] = 4) INSERT INTO [EstadosActivo] ([IdEstadoActivo], [NombreEstado]) VALUES (4, N'Dado de baja');
IF NOT EXISTS (SELECT 1 FROM [EstadosActivo] WHERE [IdEstadoActivo] = 5) INSERT INTO [EstadosActivo] ([IdEstadoActivo], [NombreEstado]) VALUES (5, N'Perdido');
SET IDENTITY_INSERT [EstadosActivo] OFF;
""");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
