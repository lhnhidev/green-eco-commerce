using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Payments.Commands;

public record CreatePaymentCommand(Guid OrderId, decimal Amount, string TransactionRef)
        : IRequest<CreatePaymentCommandResponse>
{
    public class Handler(IPaymentRepository paymentRepository)
            : IRequestHandler<CreatePaymentCommand, CreatePaymentCommandResponse>
    {
        public async Task<CreatePaymentCommandResponse> Handle(CreatePaymentCommand command, CancellationToken ct)
        {
            var payment = command.ToEntity();
            await paymentRepository.AddPaymentAsync(payment, ct);

            return payment.ToDto();
        }
    }
}
