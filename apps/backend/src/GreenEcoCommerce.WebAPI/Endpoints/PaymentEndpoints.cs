using GreenEcoCommerce.Application.Features.Payments;
using GreenEcoCommerce.Application.Features.Payments.Command;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class PaymentEndpoints
{
    public static void MapPaymentEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/payments").WithTags("Payments")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetAllPayments).RequireAuthorization();
        group.MapPost("/", CreatePayment).RequireAuthorization();
    }

    private static async Task<Created<CreatePaymentCommandResponse>> CreatePayment([FromBody] CreatePaymentCommand command, ISender sender)
    {
        var createdPayment = await sender.Send(command);
        return TypedResults.Created($"/payments/{createdPayment.Id}", createdPayment);
    }

    private static Task GetAllPayments()
    {
        throw new NotImplementedException();
    }
}
