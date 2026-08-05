using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Payments.Commands;

public record UpdatePaymentStatusCommand(Guid OrderId, PaymentStatusEnum Status) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdatePaymentStatusCommand>
    {
        public async Task Handle(UpdatePaymentStatusCommand command, CancellationToken ct)
        {
            var payment = await dbContext.Payments.FirstOrDefaultAsync(p => p.OrderId == command.OrderId, ct) ??
                          throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");

            if (payment.Status is PaymentStatusEnum.Refunded or PaymentStatusEnum.Failed && command.Status != payment.Status)
            {
                throw new BadRequestException($"Payment is already {payment.Status} and cannot be changed further.");
            }

            payment.Status = command.Status;
            await dbContext.SaveChangesAsync(ct);
        }
    }
}
