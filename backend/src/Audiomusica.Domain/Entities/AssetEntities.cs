using System.ComponentModel.DataAnnotations;

namespace Audiomusica.Domain.Entities;

public interface IHasActivo
{
    bool Activo { get; set; }
}

public class Rol
{
    public int IdRol { get; set; }
    [MaxLength(80)] public string NombreRol { get; set; } = string.Empty;
}

public class Dimension : IHasActivo
{
    public int IdDimension { get; set; }
    [MaxLength(30)] public string NumeroDimension { get; set; } = string.Empty;
    [MaxLength(120)] public string NombreDimension { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

public class Cuenta
{
    public int IdCuenta { get; set; }
    [MaxLength(80)] public string NombreCuenta { get; set; } = string.Empty;
}

public class Usuario : IHasActivo
{
    public int IdUsuario { get; set; }
    [MaxLength(80)] public string NombreUsuario { get; set; } = string.Empty;
    [MaxLength(80)] public string ApellidoPaterno { get; set; } = string.Empty;
    [MaxLength(80)] public string? ApellidoMaterno { get; set; }
    public DateTime FechaIngreso { get; set; }
    public DateTime? FinContrato { get; set; }
    public int IdRol { get; set; }
    public int IdDimension { get; set; }
    public bool Activo { get; set; } = true;
    public int? IdCuenta { get; set; }
    public Rol? Rol { get; set; }
    public Dimension? Dimension { get; set; }
    public Cuenta? Cuenta { get; set; }
}

public class Marca
{
    public int IdMarca { get; set; }
    [MaxLength(80)] public string NombreMarca { get; set; } = string.Empty;
}

public class Modelo
{
    public int IdModelo { get; set; }
    public int IdMarca { get; set; }
    [MaxLength(100)] public string NombreModelo { get; set; } = string.Empty;
    public Marca? Marca { get; set; }
}

public class Procesador
{
    public int IdProcesador { get; set; }
    [MaxLength(120)] public string NombreProcesador { get; set; } = string.Empty;
}

public class DiscoDuro
{
    public int IdDiscoDuro { get; set; }
    [MaxLength(40)] public string TipoDisco { get; set; } = string.Empty;
    public int CapacidadGB { get; set; }
    [MaxLength(160)] public string Descripcion { get; set; } = string.Empty;
}

public class EstadoActivo
{
    public int IdEstadoActivo { get; set; }
    [MaxLength(80)] public string NombreEstado { get; set; } = string.Empty;
}

public class ActivoFijo : IHasActivo
{
    public int IdActivoFijo { get; set; }
    public int IdDimension { get; set; }
    public int? IdUsuario { get; set; }
    public int? RAM { get; set; }
    public int IdMarca { get; set; }
    public int IdModelo { get; set; }
    public int? IdProcesador { get; set; }
    public int? IdDiscoDuro { get; set; }
    [MaxLength(120)] public string Serial { get; set; } = string.Empty;
    [MaxLength(80)] public string NumeroFactura { get; set; } = string.Empty;
    [MaxLength(20)] public string RutProveedor { get; set; } = string.Empty;
    public DateTime FechaCompra { get; set; }
    [MaxLength(500)] public string? Detalles { get; set; }
    public bool EsAF { get; set; } = true;
    public int IdEstadoActivo { get; set; }
    public bool Activo { get; set; } = true;
    public Dimension? Dimension { get; set; }
    public Usuario? Usuario { get; set; }
    public Marca? Marca { get; set; }
    public Modelo? Modelo { get; set; }
    public Procesador? Procesador { get; set; }
    public DiscoDuro? DiscoDuro { get; set; }
    public EstadoActivo? EstadoActivo { get; set; }
}

public class MovimientoActivoFijo
{
    public int IdMovimiento { get; set; }
    public int IdActivoFijo { get; set; }
    public int IdDimensionAnterior { get; set; }
    public int IdDimensionNueva { get; set; }
    public int? IdUsuarioAnterior { get; set; }
    public int? IdUsuarioNuevo { get; set; }
    public DateTime FechaMovimiento { get; set; }
    [MaxLength(500)] public string Observacion { get; set; } = string.Empty;
    public ActivoFijo? ActivoFijo { get; set; }
}

public class Checklist
{
    public int IdChecklist { get; set; }
    [MaxLength(160)] public string NombreChecklist { get; set; } = string.Empty;
    [MaxLength(80)] public string TipoChecklist { get; set; } = string.Empty;
    [MaxLength(180)] public string NombreArchivo { get; set; } = string.Empty;
    [MaxLength(500)] public string RutaArchivo { get; set; } = string.Empty;
    [MaxLength(20)] public string ExtensionArchivo { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
}

public class Herramienta : IHasActivo
{
    public int IdHerramienta { get; set; }
    [MaxLength(120)] public string NombreHerramienta { get; set; } = string.Empty;
    [MaxLength(80)] public string TipoHerramienta { get; set; } = string.Empty;
    [MaxLength(80)] public string? Marca { get; set; }
    [MaxLength(100)] public string? Modelo { get; set; }
    [MaxLength(120)] public string? Serial { get; set; }
    public int Cantidad { get; set; }
    public int? IdDimension { get; set; }
    [MaxLength(80)] public string Estado { get; set; } = string.Empty;
    [MaxLength(500)] public string? Detalles { get; set; }
    public DateTime FechaRegistro { get; set; }
    public bool Activo { get; set; } = true;
    public Dimension? Dimension { get; set; }
}
