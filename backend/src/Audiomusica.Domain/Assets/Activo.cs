using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Assets;

public class Activo : AuditableEntity
{
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? NumeroSerie { get; set; }
    public EstadoActivo Estado { get; set; } = EstadoActivo.Disponible;
}
