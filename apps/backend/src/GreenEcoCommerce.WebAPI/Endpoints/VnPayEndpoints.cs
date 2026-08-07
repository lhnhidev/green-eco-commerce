using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Payments.Commands;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class VnPayEndpoints
{
    public static void MapVnPayEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/payments/vnpay").WithTags("VnPay")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/create-url", CreatePaymentUrl).WithName("CreateVnPayPaymentUrl").RequireAuthorization("UserOnly");

        // VNPay redirects the customer's browser here after payment — no auth cookie is
        // required/expected from VNPay, the request is trusted via the HMAC signature instead.
        group.MapGet("/return", HandleReturn).WithName("VnPayReturn").AllowAnonymous();
    }

    private static async Task<Results<Ok<CreateVnPayPaymentUrlCommand.Response>, UnauthorizedHttpResult>> CreatePaymentUrl(
            CreateVnPayPaymentUrlRequest request, HttpContext httpContext, ISender sender)
    {
        string? userIdStr = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdStr, out var userId)) { return TypedResults.Unauthorized(); }

        string ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

        var result = await sender.Send(new CreateVnPayPaymentUrlCommand(userId, request.OrderId, ip));
        return TypedResults.Ok(result);
    }

    private static async Task<IResult> HandleReturn(HttpContext httpContext, ISender sender, IConfiguration configuration)
    {
        var vnpParams = httpContext.Request.Query.ToDictionary(kv => kv.Key, kv => kv.Value.ToString());

        var result = await sender.Send(new ConfirmVnPayReturnCommand(vnpParams));

        string frontendBaseUrl = configuration["FrontendBaseUrl"] ?? "http://localhost:5173";
        string redirectUrl = result is { Success: true, OrderId: not null }
                ? $"{frontendBaseUrl}/order-success/{result.OrderId}"
                : $"{frontendBaseUrl}/checkout?vnpay=failed";

        return TypedResults.Redirect(redirectUrl);
    }

    public record CreateVnPayPaymentUrlRequest(Guid OrderId);
}
