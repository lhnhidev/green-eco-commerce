using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class ChatSessionConfiguration : IEntityTypeConfiguration<ChatSession>
{
    public void Configure(EntityTypeBuilder<ChatSession> builder)
    {
        builder.ToTable("chat_sessions");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UserId).HasColumnName("user_id");
        builder.Property(x => x.Title).HasColumnName("title").HasMaxLength(255);

        builder.Property(x => x.CreatedAt).HasColumnName("created_at");

        builder.HasOne(x => x.User)
                .WithMany(x => x.ChatSessions)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
