using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Sap;

public class SapActivoMirror : AuditableEntity
{
    public string CodigoSap { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public DateTime FechaSincronizacion { get; set; }
}
