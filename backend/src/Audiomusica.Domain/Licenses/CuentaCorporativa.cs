using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Licenses;

public class CuentaCorporativa : AuditableEntity
{
    public string Servicio { get; set; } = string.Empty;
    public string Usuario { get; set; } = string.Empty;
    public Guid? PersonaId { get; set; }
}
