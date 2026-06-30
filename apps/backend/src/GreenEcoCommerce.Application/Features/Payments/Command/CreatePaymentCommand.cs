
using AutoMapper;
using GreenEcoCommerce.Application.Features.Payments;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Payments.Command;

public record CreatePaymentCommand(Guid OrderId, decimal Amount, string TransactionRef) : IRequest<CreatePaymentCommandResponse>;

public class CreatePaymentCommandHandler(IPaymentRepository paymentRepository, IMapper mapper) : IRequestHandler<CreatePaymentCommand, CreatePaymentCommandResponse>
{
    public async Task<CreatePaymentCommandResponse> Handle(CreatePaymentCommand command, CancellationToken cancellationToken)
    {
        var payment = mapper.Map<Domain.Entities.Payment>(command);
        await paymentRepository.AddPaymentAsync(payment);

        return mapper.Map<CreatePaymentCommandResponse>(payment);
    }
}
