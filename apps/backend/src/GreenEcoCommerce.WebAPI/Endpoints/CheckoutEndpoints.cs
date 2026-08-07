using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Checkout.Commands;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class CheckoutEndpoints
{
    public static void MapCheckoutEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/checkout").WithTags("Checkout")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", ProcessCheckout).RequireAuthorization("UserOnly");
    }

    private static async Task<Ok<CheckoutCommand.Response>> ProcessCheckout(
        CheckoutRequest request, ISender sender, HttpContext httpContext)
    {
        string? userIdStr = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdStr, out var userId)) throw new UnauthorizedAccessException();

        var command = new CheckoutCommand(
            userId,
            request.PointsToRedeem,
            request.DeliveryAddress,
            request.PaymentMethod,
            request.CouponCode,
            request.StripePaymentIntentId);

        var response = await sender.Send(command);
        return TypedResults.Ok(response);
    }
}

public record CheckoutRequest(
        int PointsToRedeem,
        string DeliveryAddress,
        PaymentMethodEnum PaymentMethod,
        string? CouponCode = null,
        string? StripePaymentIntentId = null);
