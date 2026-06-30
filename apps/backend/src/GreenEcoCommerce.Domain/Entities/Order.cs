using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Order: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public OrderStatusEnum Status { get; set; } = OrderStatusEnum.Pending;
    public required string DeliveryAddress { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal EarnedPoints { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation Properties
    public User User { get; set; } = null!;
    public PointTransaction PointTransaction { get; set; } = null!;
    public Payment? Payment { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}
