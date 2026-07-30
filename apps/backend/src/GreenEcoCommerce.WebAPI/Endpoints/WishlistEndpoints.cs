using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Products;
using GreenEcoCommerce.Application.Features.Wishlist.Commands;
using GreenEcoCommerce.Application.Features.Wishlist.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class WishlistEndpoints
{
    public static void MapWishlistEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/me/wishlist").WithTags("Wishlist")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("UserOnly");

        group.MapGet("/", GetWishlist);
        group.MapPost("/{productId:guid}", AddToWishlist);
        group.MapDelete("/{productId:guid}", RemoveFromWishlist);
        group.MapGet("/{productId:guid}/check", IsInWishlist);
    }

    private static async Task<Ok<ProductDto[]>> GetWishlist(ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new GetWishlistQuery(userId));
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<bool>> AddToWishlist(Guid productId, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new AddToWishlistCommand(userId, productId));
        return TypedResults.Ok(result);
    }

    private static async Task<NoContent> RemoveFromWishlist(Guid productId, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new RemoveFromWishlistCommand(userId, productId));
        return TypedResults.NoContent();
    }

    private static async Task<Ok<bool>> IsInWishlist(Guid productId, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new IsInWishlistQuery(userId, productId));
        return TypedResults.Ok(result);
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return !Guid.TryParse(userIdStr, out var userId) ? throw new UnauthorizedAccessException() : userId;
    }
}
