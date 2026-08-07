using GreenEcoCommerce.Application.Features.Payments.Commands;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class SePayEndpoints
{
    public static void MapSePayEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/payments/sepay").WithTags("SePay")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        // SePay calls this server-to-server whenever a transaction hits the watched bank account —
        // no user is present, so this is trusted via the Authorization header (a shared API key
        // configured identically in SePay's dashboard and appsettings), not a login cookie.
        group.MapPost("/webhook", HandleWebhook).AllowAnonymous();
    }

    private static async Task<Results<Ok<WebhookResponse>, UnauthorizedHttpResult>> HandleWebhook(
            HttpContext httpContext, SePayWebhookRequest request, ISender sender, IConfiguration configuration)
    {
        string expectedAuth = $"Apikey {configuration["SePay:ApiKey"]}";
        string? actualAuth = httpContext.Request.Headers.Authorization;

        if (string.IsNullOrEmpty(actualAuth) || actualAuth != expectedAuth)
        {
            return TypedResults.Unauthorized();
        }

        var result = await sender.Send(new ConfirmBankTransferWebhookCommand(
                request.Content, request.TransferAmount, request.TransferType, request.ReferenceCode ?? string.Empty));

        return TypedResults.Ok(new WebhookResponse(result.Matched));
    }

    public record WebhookResponse(bool Success);

    // Mirrors SePay's documented webhook payload; only the fields we use are declared.
    public record SePayWebhookRequest(
            string Content,
            string TransferType,
            long TransferAmount,
            string? ReferenceCode);
}
