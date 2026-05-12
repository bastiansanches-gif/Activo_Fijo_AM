using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Assignments;

public class AsignacionActivo : AuditableEntity
{
    public Guid ActivoId { get; set; }
    public Guid PersonaId { get; set; }
    public DateTime FechaAsignacion { get; set; }
    public DateTime? FechaDevolucion { get; set; }
}
