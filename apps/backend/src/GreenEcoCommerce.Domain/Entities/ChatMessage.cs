using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class ChatMessage: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid SessionId { get; set; }
    public ChatRoleEnum Role { get; set; }
    public required string Content { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public ChatSession? Session { get; set; }
}
