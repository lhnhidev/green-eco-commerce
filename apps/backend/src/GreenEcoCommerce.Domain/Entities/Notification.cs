using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Notification : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public required string Title { get; set; }
    public required string Message { get; set; }
    public NotificationTypeEnum Type { get; set; } = NotificationTypeEnum.OrderUpdate;
    public string? Link { get; set; }
    public bool IsRead { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public User User { get; set; } = null!;
}
