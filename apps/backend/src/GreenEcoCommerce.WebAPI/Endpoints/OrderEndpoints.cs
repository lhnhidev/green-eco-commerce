using GreenEcoCommerce.Application.Features.Orders;
using GreenEcoCommerce.Application.Features.Orders.Command;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetAllOrders).RequireAuthorization();
        group.MapPost("/", CreateOrder).RequireAuthorization();
    }

    private static async Task<Created<CreateOrderCommandResponse>> CreateOrder([FromBody] CreateOrderCommand command, ISender sender)
    {
        var createdOrder = await sender.Send(command);
        return TypedResults.Created($"/orders/{createdOrder.Id}", createdOrder);
    }

    private static Task GetAllOrders()
    {
        throw new NotImplementedException();
    }
}
