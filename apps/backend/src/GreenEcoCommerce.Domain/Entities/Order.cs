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
    public int EarnedPoints { get; set; }
    public string? CouponCode { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation Properties
    public User User { get; set; } = null!;
    public ICollection<PointTransaction> PointTransactions { get; set; } = new HashSet<PointTransaction>();
    public Payment? Payment { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}
