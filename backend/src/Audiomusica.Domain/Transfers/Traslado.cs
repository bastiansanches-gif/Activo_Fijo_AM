using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Transfers;

public class Traslado : AuditableEntity
{
    public Guid ActivoId { get; set; }
    public Guid SucursalOrigenId { get; set; }
    public Guid SucursalDestinoId { get; set; }
    public DateTime FechaTraslado { get; set; }
}
