using GreenEcoCommerce.Application.Features.OrderItems;
using GreenEcoCommerce.Application.Features.OrderItems.Command;
using GreenEcoCommerce.Application.Features.OrderItems.Query;
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
        group.MapGet("/total-co2-saved", GetTotalCo2Saved).RequireAuthorization("AdminOnly");
    }

    private static async Task<Ok<float>> GetTotalCo2Saved([AsParameters] GetTotalCo2SavedQuery query, ISender sender)
    {
        var total = await sender.Send(query);
        return TypedResults.Ok(total);
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
