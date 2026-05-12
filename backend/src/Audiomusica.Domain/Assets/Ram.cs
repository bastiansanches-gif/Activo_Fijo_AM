using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Assets;

public class Ram : BaseEntity
{
    public int CapacidadGb { get; set; }
    public string Tipo { get; set; } = string.Empty;
}
