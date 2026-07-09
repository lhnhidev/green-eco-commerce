using GreenEcoCommerce.Application.Features.Users.Queries;
using MediatR;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/users").WithTags("User")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .RequireAuthorization();

        group.MapGet("/amount-all", GetAmoutAllUser).RequireAuthorization("AdminOnly");
    }

    private static async Task<int> GetAmoutAllUser([AsParameters] GetAmountAllUsersQuery query, ISender sender)
    {
        var result = await sender.Send(query);
        return result;
    }
}
