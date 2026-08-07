namespace GreenEcoCommerce.Application.Interfaces.Payments;

public record StripeWebhookResult(string EventType, string? PaymentIntentId);

public interface IStripeService
{
    string PublishableKey { get; }

    Task<(string ClientSecret, string PaymentIntentId)> CreatePaymentIntentAsync(
            decimal amount, string orderInfo, CancellationToken ct);

    // Returns null if the signature can't be verified against the configured webhook secret.
    StripeWebhookResult? ConstructWebhookEvent(string json, string stripeSignatureHeader);

    // Server-side proof that a PaymentIntent the client claims succeeded actually did, and for the
    // expected amount — never trust a client-supplied "it succeeded" without checking with Stripe.
    Task<bool> VerifyPaymentSucceededAsync(string paymentIntentId, decimal expectedAmount, CancellationToken ct);
}
