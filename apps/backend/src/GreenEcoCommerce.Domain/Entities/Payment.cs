using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Payment: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required Guid OrderId { get; set; }
    public PaymentMethodEnum Method { get; set; } = PaymentMethodEnum.Bank;
    public PaymentStatusEnum Status { get; set; } = PaymentStatusEnum.Pending;
    public decimal Amount { get; set; }
    public required string TransactionRef { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation Properties
    public Order Order { get; set; } = null!;
}
