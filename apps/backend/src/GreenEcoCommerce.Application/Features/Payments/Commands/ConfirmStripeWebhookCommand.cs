using GreenEcoCommerce.Application.Interfaces.Payments;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Payments.Commands;

public record ConfirmStripeWebhookCommand(string Payload, string SignatureHeader)
        : IRequest<ConfirmStripeWebhookCommand.Response>
{
    public record Response(bool Success, Guid? OrderId);

    public class Handler(IApplicationDbContext dbContext, IStripeService stripeService)
            : IRequestHandler<ConfirmStripeWebhookCommand, Response>
    {
        public async Task<Response> Handle(ConfirmStripeWebhookCommand command, CancellationToken ct)
        {
            var webhookEvent = stripeService.ConstructWebhookEvent(command.Payload, command.SignatureHeader);
            if (webhookEvent?.PaymentIntentId == null)
            {
                return new Response(false, null);
            }

            bool isSuccess = webhookEvent.EventType == "payment_intent.succeeded";
            bool isFailure = webhookEvent.EventType == "payment_intent.payment_failed";
            if (!isSuccess && !isFailure)
            {
                // Other event types (e.g. payment_intent.created) are expected and ignored.
                return new Response(false, null);
            }

            var payment = await dbContext.Payments
                    .FirstOrDefaultAsync(p => p.TransactionRef == webhookEvent.PaymentIntentId, ct);
            if (payment == null)
            {
                return new Response(false, null);
            }

            // Already processed (Stripe retries webhooks until it gets a 2xx) — report the stored
            // outcome instead of re-applying it.
            if (payment.Status != PaymentStatusEnum.Pending)
            {
                return new Response(payment.Status == PaymentStatusEnum.Paid, payment.OrderId);
            }

            payment.Status = isSuccess ? PaymentStatusEnum.Paid : PaymentStatusEnum.Failed;
            await dbContext.SaveChangesAsync(ct);

            return new Response(isSuccess, payment.OrderId);
        }
    }
}
