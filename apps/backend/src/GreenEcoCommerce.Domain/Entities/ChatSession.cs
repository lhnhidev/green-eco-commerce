namespace GreenEcoCommerce.Domain.Entities;

public class ChatSession
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid UserId { get; set; }
    public required DateTime CreatedAt { get; set; }

    // Navigation properties
    public User User { get; init; } = null!;
    public ICollection<ChatMessage> Messages { get; init; } = new HashSet<ChatMessage>();
}
