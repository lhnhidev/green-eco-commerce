using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.ToTable("chat_messages");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.SessionId).HasColumnName("session_id");
        builder.Property(x => x.Role).HasColumnName("role").HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.Content).HasColumnName("content");

        builder.Property(x => x.CreatedAt).HasColumnName("created_at");

        builder.HasOne(x => x.Session)
                .WithMany(x => x.Messages)
                .HasForeignKey(x => x.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
