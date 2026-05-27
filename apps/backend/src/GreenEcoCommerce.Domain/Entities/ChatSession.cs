using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class ChatSession: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public required string Title { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public User? User { get; set; }
    public ICollection<ChatMessage> Messages { get; set; } = new HashSet<ChatMessage>();
}
