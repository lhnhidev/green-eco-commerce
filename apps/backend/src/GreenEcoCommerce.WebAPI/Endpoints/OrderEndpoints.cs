using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Features.Orders;
using GreenEcoCommerce.Application.Features.Orders.Commands;
using GreenEcoCommerce.Application.Features.Orders.Queries;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        var adminGroup = app.MapGroup("/api/orders")
                .WithTags("Orders")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("AdminOnly");

        adminGroup.MapGet("/", GetAllOrders);
        adminGroup.MapPatch("/{id:guid}/status", UpdateOrderStatus);

        var userGroup = app.MapGroup("/api/me/orders")
                .WithTags("My Orders")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("UserOnly");

        userGroup.MapGet("/", GetMyOrders);
    }

    private static async Task<Ok<PagedResult<OrderDto>>> GetAllOrders([AsParameters] GetAllOrdersQuery.Parameters query, ISender sender)
    {
        var orders = await sender.Send(new GetAllOrdersQuery(query));
        return TypedResults.Ok(orders);
    }

    private static async Task<Ok<PagedResult<OrderDto>>> GetMyOrders([AsParameters] GetAllOrdersQuery.Parameters query, ISender sender)
    {
        var orders = await sender.Send(new GetAllOrdersQuery(query));
        return TypedResults.Ok(orders);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateOrderStatus(Guid id, UpdateOrderStatusRequest body, ISender sender)
    {
        await sender.Send(new UpdateOrderStatusCommand(id, body.Status));
        return TypedResults.NoContent();
    }
}

public record UpdateOrderStatusRequest(OrderStatusEnum Status);
