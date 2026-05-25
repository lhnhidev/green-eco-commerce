using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Domain.Entities;

public class Payment
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid OrderId { get; set; }
    public required PaymentMethodEnum Method { get; set; }
    public required PaymentStatusEnum Status { get; set; }
    public required decimal Amount { get; set; }
    public required string TransactionRef { get; set; }

    // Navigation property
    public Order Order { get; init; } = null!;
}
