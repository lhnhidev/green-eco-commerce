using GreenEcoCommerce.Application.Interfaces.Payments;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Payments.Commands;

public record CreateVnPayPaymentUrlCommand(Guid UserId, Guid OrderId, string IpAddress)
        : IRequest<CreateVnPayPaymentUrlCommand.Response>
{
    public record Response(string PaymentUrl);

    public class Handler(IApplicationDbContext dbContext, IVnPayService vnPayService)
            : IRequestHandler<CreateVnPayPaymentUrlCommand, Response>
    {
        public async Task<Response> Handle(CreateVnPayPaymentUrlCommand command, CancellationToken ct)
        {
            var payment = await dbContext.Payments
                    .Include(p => p.Order)
                    .FirstOrDefaultAsync(p => p.OrderId == command.OrderId && p.Order.UserId == command.UserId, ct);

            if (payment == null) { throw new NotFoundException("Order not found."); }

            if (payment.Status != PaymentStatusEnum.Pending)
            {
                throw new BadRequestException("This order is not awaiting payment.");
            }

            string url = vnPayService.CreatePaymentUrl(
                    transactionRef: payment.TransactionRef,
                    amount: payment.Amount,
                    orderInfo: $"Thanh toan don hang {command.OrderId}",
                    ipAddress: command.IpAddress);

            return new Response(url);
        }
    }
}
