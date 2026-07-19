using GreenEcoCommerce.Application.Features.GreenWallets;
using GreenEcoCommerce.Application.Features.GreenWallets.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class GreenWalletEndpoints
{
    public static void MapGreenWalletEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/green-wallets/{userId:guid}").WithTags("GreenWallets")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetGreenWallet);
    }

    private static async Task<Ok<GreenWalletDto>> GetGreenWallet(Guid userId, ISender sender)
    {
        var greenWallet = await sender.Send(new GetUserGreenWalletQuery(userId));
        return TypedResults.Ok(greenWallet);
    }
}
