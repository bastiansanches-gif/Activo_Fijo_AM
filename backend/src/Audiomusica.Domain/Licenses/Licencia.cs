using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Licenses;

public class Licencia : AuditableEntity
{
    public string Nombre { get; set; } = string.Empty;
    public DateTime? FechaExpiracion { get; set; }
}
