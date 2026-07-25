using System.Security.Claims;
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
        // Authenticated user: submit/update a review
        app.MapPost("/api/products/{productId:guid}/reviews", CreateReview)
                .WithTags("Reviews").RequireAuthorization("UserOnly")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        // Admin: list all reviews with optional filter
        var adminGroup = app.MapGroup("/api/admin/reviews")
                .WithTags("Reviews Admin").RequireAuthorization("AdminOnly")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        adminGroup.MapGet("/", GetAllReviews);
        adminGroup.MapPatch("/{id:guid}/approve", ApproveReview);
        adminGroup.MapPatch("/{id:guid}/hide", HideReview);
        adminGroup.MapDelete("/{id:guid}", DeleteReview);
    }

    private static async Task<Ok<ReviewDto>> CreateReview(Guid productId, ReviewPayloadDto body,
                                                          ClaimsPrincipal user, ISender sender)
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await sender.Send(new CreateReviewCommand(productId, userId, body));
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<ReviewDto[]>> GetAllReviews([AsParameters] GetAllReviewsQuery query, ISender sender) =>
            TypedResults.Ok(await sender.Send(query));

    private static async Task<Results<Ok<ReviewDto>, NotFound>> ApproveReview(Guid id, ISender sender)
    {
        var result = await sender.Send(new ApproveReviewCommand(id));
        return result is not null ? TypedResults.Ok(result) : TypedResults.NotFound();
    }

    private static async Task<Results<Ok<ReviewDto>, NotFound>> HideReview(Guid id, ISender sender)
    {
        var result = await sender.Send(new HideReviewCommand(id));
        return result is not null ? TypedResults.Ok(result) : TypedResults.NotFound();
    }

    private static async Task<NoContent> DeleteReview(Guid id, ISender sender)
    {
        await sender.Send(new DeleteReviewCommand(id));
        return TypedResults.NoContent();
    }
}
