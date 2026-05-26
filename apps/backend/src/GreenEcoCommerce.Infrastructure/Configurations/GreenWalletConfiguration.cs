using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class GreenWalletConfiguration : IEntityTypeConfiguration<GreenWallet>
{
    public void Configure(EntityTypeBuilder<GreenWallet> builder)
    {
        builder.ToTable("green_wallets");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UserId).HasColumnName("user_id");
        builder.Property(x => x.Balance).HasColumnName("balance").HasPrecision(15, 2);
        builder.Property(x => x.EarnedTotal).HasColumnName("earned_total").HasPrecision(15, 2);

        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
    }
}
