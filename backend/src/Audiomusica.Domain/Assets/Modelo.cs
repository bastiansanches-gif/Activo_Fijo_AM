using Audiomusica.Domain.Common;

namespace Audiomusica.Domain.Assets;

public class Modelo : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;
    public Guid MarcaId { get; set; }
}
