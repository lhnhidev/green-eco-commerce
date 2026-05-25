using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Domain.Entities;

public class ChatMessage
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid SessionId { get; set; }
    public required ChatRoleEnum Role { get; set; }
    public required string Content { get; set; }
    public required DateTime CreatedAt { get; set; }

    // Navigation property
    public ChatSession Session { get; init; } = null!;
}
