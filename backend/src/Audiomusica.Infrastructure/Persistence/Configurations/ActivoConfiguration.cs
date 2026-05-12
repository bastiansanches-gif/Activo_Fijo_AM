using Audiomusica.Domain.Assets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Audiomusica.Infrastructure.Persistence.Configurations;

public class ActivoConfiguration : IEntityTypeConfiguration<Activo>
{
    public void Configure(EntityTypeBuilder<Activo> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Codigo).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(x => x.NumeroSerie).HasMaxLength(100);
    }
}
