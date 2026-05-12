using Audiomusica.Domain.Sap;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Audiomusica.Infrastructure.Persistence.Configurations;

public class SapActivoMirrorConfiguration : IEntityTypeConfiguration<SapActivoMirror>
{
    public void Configure(EntityTypeBuilder<SapActivoMirror> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CodigoSap).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Descripcion).HasMaxLength(250).IsRequired();
    }
}
