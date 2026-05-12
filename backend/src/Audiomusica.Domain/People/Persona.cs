using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.People;

public class Persona : AuditableEntity
{
    public string Rut { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
