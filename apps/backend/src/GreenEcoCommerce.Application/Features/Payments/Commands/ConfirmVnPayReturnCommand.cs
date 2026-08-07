using GreenEcoCommerce.Application.Interfaces.Payments;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Payments.Commands;

public record ConfirmVnPayReturnCommand(IDictionary<string, string> VnPayParams)
        : IRequest<ConfirmVnPayReturnCommand.Response>
{
    public record Response(bool Success, Guid? OrderId);

    public class Handler(IApplicationDbContext dbContext, IVnPayService vnPayService)
            : IRequestHandler<ConfirmVnPayReturnCommand, Response>
    {
        public async Task<Response> Handle(ConfirmVnPayReturnCommand command, CancellationToken ct)
        {
            if (!vnPayService.ValidateSignature(command.VnPayParams))
            {
                return new Response(false, null);
            }

            if (!command.VnPayParams.TryGetValue("vnp_TxnRef", out var txnRef) || string.IsNullOrEmpty(txnRef))
            {
                return new Response(false, null);
            }

            var payment = await dbContext.Payments.FirstOrDefaultAsync(p => p.TransactionRef == txnRef, ct);
            if (payment == null)
            {
                return new Response(false, null);
            }

            // Already processed (user refreshed the return page, or the browser retried the redirect) —
            // report the stored outcome instead of re-applying it.
            if (payment.Status != PaymentStatusEnum.Pending)
            {
                return new Response(payment.Status == PaymentStatusEnum.Paid, payment.OrderId);
            }

            bool isSuccess = command.VnPayParams.TryGetValue("vnp_ResponseCode", out var code) && code == "00";

            payment.Status = isSuccess ? PaymentStatusEnum.Paid : PaymentStatusEnum.Failed;
            await dbContext.SaveChangesAsync(ct);

            return new Response(isSuccess, payment.OrderId);
        }
    }
}
