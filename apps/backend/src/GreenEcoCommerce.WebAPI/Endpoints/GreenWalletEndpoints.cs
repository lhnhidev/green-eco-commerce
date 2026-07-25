using System.Security.Claims;
using GreenEcoCommerce.Application.Features.GreenWallets;
using GreenEcoCommerce.Application.Features.GreenWallets.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class GreenWalletEndpoints
{
    public static void MapGreenWalletEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/green-wallets").WithTags("GreenWallets")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetGreenWallet);
    }

    private static async Task<Ok<GreenWalletDto>> GetGreenWallet(ClaimsPrincipal user, ISender sender)
    {
        var userId = Guid.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
        var greenWallet = await sender.Send(new GetUserGreenWalletQuery(userId));
        return TypedResults.Ok(greenWallet);
    }
}
