using GreenEcoCommerce.Application.Features.OrderItems;
using GreenEcoCommerce.Application.Features.OrderItems.Command;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class OrderItemEndpoints
{
    public static void MapOrderItemEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/order-items").WithTags("OrderItems")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetAllOrderItems).RequireAuthorization();
        group.MapPost("/", CreateOrderItem).RequireAuthorization();
    }

    private static async Task<Created<CreateOrderItemCommandResponse>> CreateOrderItem([FromBody] CreateOrderItemCommand command, ISender sender)
    {
        var createdOrderItem = await sender.Send(command);
        return TypedResults.Created($"/order-items/{createdOrderItem.Id}", createdOrderItem);
    }

    private static Task GetAllOrderItems()
    {
        throw new NotImplementedException();
    }
}
