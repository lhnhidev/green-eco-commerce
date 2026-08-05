using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Profile;
using GreenEcoCommerce.Application.Features.Profile.Commands;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class ProfileEndpoints
{
    public static void MapProfileEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/users").WithTags("User Profile")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .RequireAuthorization();

        group.MapPut("/", UpdateUserProfile);
    }

    private static async Task<Results<Ok<UserProfileDto>, NotFound>> UpdateUserProfile(
        ClaimsPrincipal user, UserProfilePayloadDto payload, ISender sender)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) return TypedResults.NotFound();

        var result = await sender.Send(new UpdateUserProfileCommand(userId, payload));
        return TypedResults.Ok(result);
    }
}

