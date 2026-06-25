using AutoMapper;
using GreenEcoCommerce.Application.Features.Payments.Command;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.Features.Payments;

public record CreatePaymentCommandResponse(Guid Id, Guid OrderId, PaymentMethodEnum Method, PaymentStatusEnum Status, decimal Amount, DateTimeOffset CreatedAt);

public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        CreateMap<CreatePaymentCommand, Domain.Entities.Payment>();
        CreateMap<Domain.Entities.Payment, CreatePaymentCommandResponse>();
    }
}
