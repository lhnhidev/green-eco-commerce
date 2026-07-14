using GreenEcoCommerce.Application.Features.Payments.Command;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Payments;

public record CreatePaymentCommandResponse(Guid Id, Guid OrderId, PaymentMethodEnum Method, PaymentStatusEnum Status, decimal Amount, DateTimeOffset CreatedAt);

[Mapper]
public static partial class PaymentDtoMapper
{
    public static partial CreatePaymentCommandResponse ToDto(this Payment payment);
    public static partial Domain.Entities.Payment ToEntity(this CreatePaymentCommand command);
}
