using Audiomusica.Domain.Assets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Audiomusica.Infrastructure.Persistence.Configurations;

public class ModeloConfiguration : IEntityTypeConfiguration<Modelo>
{
    public void Configure(EntityTypeBuilder<Modelo> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).HasMaxLength(100).IsRequired();
    }
}
