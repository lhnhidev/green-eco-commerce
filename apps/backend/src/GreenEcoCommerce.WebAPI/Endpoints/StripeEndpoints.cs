using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Payments.Commands;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class StripeEndpoints
{
    public static void MapStripeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/payments/stripe").WithTags("Stripe")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/create-intent", CreatePaymentIntent).WithName("CreateStripePaymentIntent")
                .RequireAuthorization("UserOnly");

        // Stripe calls this server-to-server whenever a PaymentIntent's status changes — no user
        // is present, so this is trusted via the Stripe-Signature header, not a login cookie.
        group.MapPost("/webhook", HandleStripeWebhook).WithName("StripeWebhook").AllowAnonymous();
    }

    private static async Task<Results<Ok<CreateStripePaymentIntentCommand.Response>, UnauthorizedHttpResult>> CreatePaymentIntent(
            CreateStripePaymentIntentRequest request, HttpContext httpContext, ISender sender)
    {
        string? userIdStr = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdStr, out var userId)) { return TypedResults.Unauthorized(); }

        var result = await sender.Send(
                new CreateStripePaymentIntentCommand(userId, request.PointsToRedeem, request.CouponCode));
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<WebhookResponse>> HandleStripeWebhook(HttpContext httpContext, ISender sender)
    {
        string signature = httpContext.Request.Headers["Stripe-Signature"].ToString();
        using var reader = new StreamReader(httpContext.Request.Body);
        string payload = await reader.ReadToEndAsync();

        var result = await sender.Send(new ConfirmStripeWebhookCommand(payload, signature));

        // Always 200 for a structurally valid webhook call so Stripe doesn't keep retrying —
        // "unmatched"/ignored events are a normal outcome, not an error.
        return TypedResults.Ok(new WebhookResponse(result.Success));
    }

    public record CreateStripePaymentIntentRequest(int PointsToRedeem, string? CouponCode = null);

    public record WebhookResponse(bool Success);
}
