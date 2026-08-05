using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Carts;
using GreenEcoCommerce.Application.Features.Carts.Commands;
using GreenEcoCommerce.Application.Features.Carts.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class CartEndpoints
{
    public static void MapCartEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/cart").WithTags("Cart").ProducesProblem(StatusCodes.Status500InternalServerError)
                .ProducesProblem(StatusCodes.Status401Unauthorized).ProducesProblem(StatusCodes.Status403Forbidden)
                .RequireAuthorization("UserOnly");

        group.MapGet("/", GetCart);
        group.MapPost("/items", AddCartItem);
        group.MapPut("/items", UpdateCartItem);
        group.MapDelete("/items/{productId:guid}", RemoveCartItem);
        group.MapDelete("/", ClearCart);
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID in token");
        }

        return userId;
    }

    private static async Task<Ok<CartDto>> GetCart(ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var cart = await sender.Send(new GetCartQuery(userId));
        return TypedResults.Ok(cart);
    }

    private static async Task<Ok<CartDto>> AddCartItem(ClaimsPrincipal user, CartItemPayloadDto payload,
                                                       ISender sender)
    {
        var userId = GetUserId(user);
        var cart = await sender.Send(new AddCartItemCommand(userId, payload));
        return TypedResults.Ok(cart);
    }

    private static async Task<Ok<CartDto>> UpdateCartItem(ClaimsPrincipal user, CartItemPayloadDto payload, ISender sender)
    {
        var userId = GetUserId(user);
        var cart = await sender.Send(new UpdateCartItemCommand(userId, payload));
        return TypedResults.Ok(cart);
    }

    private static async Task<Ok<CartDto>> RemoveCartItem(Guid productId, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var cart = await sender.Send(new RemoveCartItemCommand(userId, productId));
        return TypedResults.Ok(cart);
    }

    private static async Task<NoContent> ClearCart(ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new ClearCartCommand(userId));
        return TypedResults.NoContent();
    }
}
