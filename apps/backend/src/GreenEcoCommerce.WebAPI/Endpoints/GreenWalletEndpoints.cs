using GreenEcoCommerce.Application.Features.GreenWallets;
using GreenEcoCommerce.Application.Features.GreenWallets.Command;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class GreenWalletEndpoints
{
    public static void MapGreenWalletEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/green-wallets/{userId:guid}").WithTags("GreenWallets")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .RequireAuthorization();

        group.MapPost("/", CreateGreenWallet);
    }

    private static async Task<Created<CreateGreenWalletCommandResponse>> CreateGreenWallet([FromRoute] Guid userId, ISender sender)
    {
        var greenWallet = await sender.Send(new CreateGreenWalletCommand(userId));
        return TypedResults.Created($"/api/green-wallets/{greenWallet.Id}", greenWallet);
    }
}
