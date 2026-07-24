using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Statistics.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class MeStatisticsEndpoints
{
    public static void MapMeStatisticsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/me/statistics").WithTags("My Statistics")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .RequireAuthorization("UserOnly");

        group.MapGet("/", GetMyStatistics);
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

    private static async Task<Ok<GetMyStatisticsQuery.Response>> GetMyStatistics(
        int? months, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new GetMyStatisticsQuery(userId, months ?? 6));
        return TypedResults.Ok(result);
    }
}