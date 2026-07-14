using GreenEcoCommerce.Application.Features.Orders;
using GreenEcoCommerce.Application.Features.Orders.Commands;
using GreenEcoCommerce.Application.Features.Orders.Queries;
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

        group.MapGet("/all", GetAllOrders).RequireAuthorization("AdminOnly");
        group.MapGet("/", GetMyOrders).RequireAuthorization();
        group.MapPost("/", CreateOrder).RequireAuthorization();
    }

    private static async Task<Created<OrderDto>> CreateOrder([FromBody] CreateOrderCommand command, ISender sender)
    {
        var createdOrder = await sender.Send(command);
        return TypedResults.Created($"/orders/{createdOrder.Id}", createdOrder);
    }

    private static async Task<Ok<OrderDto[]>> GetAllOrders([AsParameters] GetAllOrdersQuery query, ISender sender)
    {
        var orders = await sender.Send(query);
        return TypedResults.Ok(orders);
    }

    private static async Task<Ok<OrderDto[]>> GetMyOrders([AsParameters] GetAllOrdersQuery query, ISender sender)
    {
        // TODO: Actually filter by user. For now, returning all to avoid breaking changes.
        var orders = await sender.Send(query);
        return TypedResults.Ok(orders);
    }
}
