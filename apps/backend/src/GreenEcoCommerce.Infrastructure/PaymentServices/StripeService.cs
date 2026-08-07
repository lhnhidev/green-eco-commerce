using GreenEcoCommerce.Application.Interfaces.Payments;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace GreenEcoCommerce.Infrastructure.PaymentServices;

public class StripeService : IStripeService
{
    private readonly string secretKey;
    private readonly string webhookSecret;
    private readonly PaymentIntentService paymentIntentService;

    public StripeService(IConfiguration configuration)
    {
        secretKey = configuration["Stripe:SecretKey"] ?? string.Empty;
        webhookSecret = configuration["Stripe:WebhookSecret"] ?? string.Empty;
        PublishableKey = configuration["Stripe:PublishableKey"] ?? string.Empty;

        var client = new StripeClient(secretKey);
        paymentIntentService = new PaymentIntentService(client);
    }

    public string PublishableKey { get; }

    public async Task<(string ClientSecret, string PaymentIntentId)> CreatePaymentIntentAsync(
            decimal amount, string orderInfo, CancellationToken ct)
    {
        var intent = await paymentIntentService.CreateAsync(new PaymentIntentCreateOptions
        {
            Amount = ToCents(amount),
            Currency = "usd",
            Description = orderInfo,
            // Card only — the checkout flow relies on stripe.confirmPayment({ redirect: 'if_required' })
            // resolving inline without ever navigating away; redirect-based methods (bank transfers,
            // wallets that require leaving the page) would break that assumption.
            PaymentMethodTypes = ["card"],
        }, cancellationToken: ct);

        return (intent.ClientSecret, intent.Id);
    }

    public StripeWebhookResult? ConstructWebhookEvent(string json, string stripeSignatureHeader)
    {
        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(json, stripeSignatureHeader, webhookSecret);
        }
        catch (StripeException)
        {
            return null;
        }

        string? paymentIntentId = stripeEvent.Data.Object is PaymentIntent paymentIntent ? paymentIntent.Id : null;
        return new StripeWebhookResult(stripeEvent.Type, paymentIntentId);
    }

    public async Task<bool> VerifyPaymentSucceededAsync(string paymentIntentId, decimal expectedAmount, CancellationToken ct)
    {
        PaymentIntent intent;
        try
        {
            intent = await paymentIntentService.GetAsync(paymentIntentId, cancellationToken: ct);
        }
        catch (StripeException)
        {
            return false;
        }

        return intent.Status == "succeeded" && intent.Amount == ToCents(expectedAmount);
    }

    // Stripe expects USD amounts as an integer number of cents.
    private static long ToCents(decimal amount) => (long)Math.Round(amount * 100, MidpointRounding.AwayFromZero);
}
