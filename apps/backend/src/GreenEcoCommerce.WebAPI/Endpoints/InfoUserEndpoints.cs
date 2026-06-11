using GreenEcoCommerce.Application.Features.InfoUser;
using GreenEcoCommerce.Application.Features.InfoUser.Commands;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class InfoUserEndpoints
{
    public static void MapInfoUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/info-user").WithTags("Information of user")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:guid}", UpdateInfoUser).RequireAuthorization();
    }

    private static async Task<Ok<UpdateInfoUserResponse>> UpdateInfoUser([FromRoute] Guid id, [FromBody] UpdateInfoUserDto dto, ISender sender)
    {
        var command = new UpdateInfoUserCommand(id, dto);
        var infoUserUpdated = await sender.Send(command);
        return TypedResults.Ok(infoUserUpdated);
    }
}
