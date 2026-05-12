using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Locations;

public class CentroCosto : BaseEntity
{
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
}
