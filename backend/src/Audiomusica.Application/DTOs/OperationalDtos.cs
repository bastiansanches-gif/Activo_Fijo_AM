namespace Audiomusica.Application.DTOs;

public sealed record CreateRolDto(string NombreRol);
public sealed record UpdateRolDto(string NombreRol);
public sealed record RolResponseDto(int IdRol, string NombreRol);

public sealed record CreateDimensionDto(string NumeroDimension, string NombreDimension, bool Activo);
public sealed record UpdateDimensionDto(string NumeroDimension, string NombreDimension, bool Activo);
public sealed record DimensionResponseDto(int IdDimension, string NumeroDimension, string NombreDimension, bool Activo);

public sealed record CreateCuentaDto(string NombreCuenta);
public sealed record UpdateCuentaDto(string NombreCuenta);
public sealed record CuentaResponseDto(int IdCuenta, string NombreCuenta);

public sealed record CreateUsuarioCuentaDto(int IdUsuario, int IdCuenta);
public sealed record UpdateUsuarioCuentaDto(int IdUsuario, int IdCuenta);
public sealed record UsuarioCuentaResponseDto(int IdUsuarioCuenta, int IdUsuario, int IdCuenta, string? NombreCuenta);

public sealed class CreateUsuarioDto
{
    public string Rut { get; init; } = string.Empty;
    public string NombreUsuario { get; init; } = string.Empty;
    public string ApellidoPaterno { get; init; } = string.Empty;
    public string? ApellidoMaterno { get; init; }
    public string CorreoCorporativo { get; init; } = string.Empty;
    public DateTime FechaIngreso { get; init; }
    public DateTime? FinContrato { get; init; }
    public int IdRol { get; init; }
    public int IdDimension { get; init; }
    public bool Activo { get; init; }
    public int[] IdCuentas { get; init; } = [];
}

public sealed class UpdateUsuarioDto
{
    public string Rut { get; init; } = string.Empty;
    public string NombreUsuario { get; init; } = string.Empty;
    public string ApellidoPaterno { get; init; } = string.Empty;
    public string? ApellidoMaterno { get; init; }
    public string CorreoCorporativo { get; init; } = string.Empty;
    public DateTime FechaIngreso { get; init; }
    public DateTime? FinContrato { get; init; }
    public int IdRol { get; init; }
    public int IdDimension { get; init; }
    public bool Activo { get; init; }
    public int[] IdCuentas { get; init; } = [];
}

public sealed record UsuarioCuentaItemDto(int IdCuenta, string NombreCuenta);

public sealed record UsuarioResponseDto(
    int IdUsuario,
    string Rut,
    string NombreUsuario,
    string ApellidoPaterno,
    string? ApellidoMaterno,
    string CorreoCorporativo,
    DateTime FechaIngreso,
    DateTime? FinContrato,
    int IdRol,
    string? NombreRol,
    int IdDimension,
    string? NombreDimension,
    bool Activo,
    IReadOnlyList<UsuarioCuentaItemDto> Cuentas);

public sealed record CreateMarcaDto(string NombreMarca);
public sealed record UpdateMarcaDto(string NombreMarca);
public sealed record MarcaResponseDto(int IdMarca, string NombreMarca);

public sealed record CreateModeloDto(int IdMarca, string NombreModelo);
public sealed record UpdateModeloDto(int IdMarca, string NombreModelo);
public sealed record ModeloResponseDto(int IdModelo, int IdMarca, string? NombreMarca, string NombreModelo);

public sealed record CreateProcesadorDto(string NombreProcesador);
public sealed record UpdateProcesadorDto(string NombreProcesador);
public sealed record ProcesadorResponseDto(int IdProcesador, string NombreProcesador);

public sealed record CreateDiscoDuroDto(string TipoDisco, int CapacidadGB, string Descripcion);
public sealed record UpdateDiscoDuroDto(string TipoDisco, int CapacidadGB, string Descripcion);
public sealed record DiscoDuroResponseDto(int IdDiscoDuro, string TipoDisco, int CapacidadGB, string Descripcion);

public sealed record CreateEstadoActivoDto(string NombreEstado);
public sealed record UpdateEstadoActivoDto(string NombreEstado);
public sealed record EstadoActivoResponseDto(int IdEstadoActivo, string NombreEstado);

public sealed class CreateActivoFijoDto
{
    public int IdDimension { get; init; }
    public int? IdUsuario { get; init; }
    public int? RAM { get; init; }
    public int IdMarca { get; init; }
    public int IdModelo { get; init; }
    public int? IdProcesador { get; init; }
    public int? IdDiscoDuro { get; init; }
    public string Serial { get; init; } = string.Empty;
    public string? NumeroFactura { get; init; }
    public string? RutProveedor { get; init; }
    public DateTime? FechaCompra { get; init; }
    public string? Detalles { get; init; }
    public int IdEstadoActivo { get; init; }
}

public sealed class UpdateActivoFijoDto
{
    public int IdDimension { get; init; }
    public int? IdUsuario { get; init; }
    public int? RAM { get; init; }
    public int IdMarca { get; init; }
    public int IdModelo { get; init; }
    public int? IdProcesador { get; init; }
    public int? IdDiscoDuro { get; init; }
    public string Serial { get; init; } = string.Empty;
    public string? NumeroFactura { get; init; }
    public string? RutProveedor { get; init; }
    public DateTime? FechaCompra { get; init; }
    public string? Detalles { get; init; }
    public int IdEstadoActivo { get; init; }
}

public sealed record ActivoFijoResponseDto(
    int IdActivoFijo,
    int IdDimension,
    string? NombreDimension,
    int? IdUsuario,
    string? NombreUsuario,
    int? RAM,
    int IdMarca,
    string? NombreMarca,
    int IdModelo,
    string? NombreModelo,
    int? IdProcesador,
    string? NombreProcesador,
    int? IdDiscoDuro,
    string? TipoDisco,
    int? CapacidadGB,
    string Serial,
    string NumeroFactura,
    string RutProveedor,
    DateTime FechaCompra,
    string? Detalles,
    bool EsAF,
    int IdEstadoActivo,
    string? NombreEstado);

public sealed record CreateMovimientoActivoFijoDto(
    int IdActivoFijo,
    int? IdDimensionAnterior,
    int? IdDimensionNueva,
    int? IdUsuarioAnterior,
    int? IdUsuarioNuevo,
    DateTime FechaMovimiento,
    string Observacion);

public sealed record UpdateMovimientoActivoFijoDto(
    int IdActivoFijo,
    int? IdDimensionAnterior,
    int? IdDimensionNueva,
    int? IdUsuarioAnterior,
    int? IdUsuarioNuevo,
    DateTime FechaMovimiento,
    string Observacion);

public sealed record MovimientoActivoFijoResponseDto(
    int IdMovimiento,
    int IdActivoFijo,
    int? IdDimensionAnterior,
    int? IdDimensionNueva,
    int? IdUsuarioAnterior,
    int? IdUsuarioNuevo,
    DateTime FechaMovimiento,
    string Observacion);

public sealed record CreateChecklistDto(
    string NombreChecklist,
    string? TipoChecklist,
    string NombreArchivo,
    string RutaArchivo,
    string ExtensionArchivo);

public sealed record UpdateChecklistDto(
    string NombreChecklist,
    string? TipoChecklist,
    string NombreArchivo,
    string RutaArchivo,
    string ExtensionArchivo);

public sealed record ChecklistResponseDto(
    int IdChecklist,
    string NombreChecklist,
    string TipoChecklist,
    string NombreArchivo,
    string RutaArchivo,
    string ExtensionArchivo,
    DateTime FechaCreacion);

public sealed record CreateHerramientaDto(
    string NombreHerramienta,
    string? TipoHerramienta,
    string? Marca,
    string? Modelo,
    string? Serial,
    int Cantidad,
    int? IdDimension,
    string? Estado,
    string? Detalles);

public sealed record UpdateHerramientaDto(
    string NombreHerramienta,
    string? TipoHerramienta,
    string? Marca,
    string? Modelo,
    string? Serial,
    int Cantidad,
    int? IdDimension,
    string? Estado,
    string? Detalles,
    bool Activo);

public sealed record HerramientaResponseDto(
    int IdHerramienta,
    string NombreHerramienta,
    string? TipoHerramienta,
    string? Marca,
    string? Modelo,
    string? Serial,
    int Cantidad,
    int? IdDimension,
    string? NombreDimension,
    string? Estado,
    string? Detalles,
    DateTime FechaRegistro,
    bool Activo);
