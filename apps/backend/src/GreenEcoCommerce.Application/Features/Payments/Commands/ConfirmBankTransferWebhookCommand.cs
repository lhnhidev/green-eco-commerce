using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Payments.Commands;

// Fired by the SePay bank-transfer webhook. Every QR-code order requests the same small fixed
// amount (see PaymentQr.tsx), so orders can't be told apart by amount — matching instead relies
// on the order's short code (its Id's last 8 hex chars, same convention as the invoice/order-number
// display) appearing in the transfer content.
public record ConfirmBankTransferWebhookCommand(string Content, long TransferAmount, string TransferType, string ReferenceCode)
        : IRequest<ConfirmBankTransferWebhookCommand.Response>
{
    public record Response(bool Matched, Guid? OrderId);

    private const long ExpectedTransferAmount = 10000;

    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<ConfirmBankTransferWebhookCommand, Response>
    {
        public async Task<Response> Handle(ConfirmBankTransferWebhookCommand command, CancellationToken ct)
        {
            if (command.TransferType != "in" || command.TransferAmount != ExpectedTransferAmount)
            {
                return new Response(false, null);
            }

            string normalizedContent = command.Content.ToUpperInvariant().Replace(" ", "");

            var pendingPayments = await dbContext.Payments
                    .Where(p => p.Status == PaymentStatusEnum.Pending &&
                                (p.Method == PaymentMethodEnum.Bank || p.Method == PaymentMethodEnum.MoMo))
                    .ToListAsync(ct);

            var match = pendingPayments.FirstOrDefault(
                    p => normalizedContent.Contains(p.OrderId.ToString()[^8..].ToUpperInvariant()));

            if (match == null)
            {
                return new Response(false, null);
            }

            match.Status = PaymentStatusEnum.Paid;
            match.TransactionRef = command.ReferenceCode;
            await dbContext.SaveChangesAsync(ct);

            return new Response(true, match.OrderId);
        }
    }
}
