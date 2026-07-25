using System.Security.Claims;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Features.Reviews;
using GreenEcoCommerce.Application.Features.Reviews.Commands;
using GreenEcoCommerce.Application.Features.Reviews.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class ReviewEndpoints
{
    public static void MapReviewEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/products/{productId:guid}/reviews").WithTags("Reviews")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetProductReviews);
        group.MapPost("/", CreateReview).RequireAuthorization("UserOnly")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .ProducesProblem(StatusCodes.Status409Conflict);
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

    private static async Task<Ok<PagedResult<ReviewDto>>> GetProductReviews(
        Guid productId, [AsParameters] GetProductReviewsQuery.Parameters query, ISender sender)
    {
        var reviews = await sender.Send(new GetProductReviewsQuery(productId, query));
        return TypedResults.Ok(reviews);
    }

    private static async Task<Created<ReviewDto>> CreateReview(
        Guid productId, CreateReviewPayloadDto payload, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var review = await sender.Send(new CreateReviewCommand(productId, userId, payload));
        return TypedResults.Created($"/api/products/{productId}/reviews/{review.Id}", review);
    }
}