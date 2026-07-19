using GreenEcoCommerce.Application.Features.Payments.Commands;
using GreenEcoCommerce.Application.Features.Payments.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class PaymentEndpoints
{
    public static void MapPaymentEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/payments").WithTags("Payments")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .RequireAuthorization("AdminOnly");

        group.MapGet("/total-revenue", GetTotalRevenue);
        group.MapPatch("/", UpdatePaymentStatus);
    }

    private static async Task<Ok<decimal>> GetTotalRevenue(ISender sender)
    {
        decimal total = await sender.Send(new GetTotalRevenueQuery());
        return TypedResults.Ok(total);
    }

    private static async Task<Results<NoContent, NotFound>> UpdatePaymentStatus(UpdatePaymentStatusCommand command, ISender sender)
    {
        await sender.Send(command);
        return TypedResults.NoContent();
    }
}
