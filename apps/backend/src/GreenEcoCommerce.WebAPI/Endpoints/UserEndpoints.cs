using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Features.Users;
using GreenEcoCommerce.Application.Features.Users.Commands;
using GreenEcoCommerce.Application.Features.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/users").WithTags("User")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization("AdminOnly");

        group.MapGet("/", GetAllUsers);
        group.MapGet("/{id:guid}", GetUserById);
        group.MapPost("/", CreateUser);
        group.MapPut("/{id:guid}", UpdateUser);
        group.MapDelete("/{id:guid}", DeleteUser);

        group.MapPatch("/{id:guid}/activate", ActivateUser);
        group.MapPatch("/{id:guid}/deactivate", DeactivateUser);
    }

    private static async Task<Ok<PagedResult<UserDto>>> GetAllUsers([AsParameters] GetAllUsersQuery.Parameters query,
                                                                    ISender sender)
    {
        var result = await sender.Send(new GetAllUsersQuery(query));
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<UserDto>, NotFound>> GetUserById(Guid id, ISender sender)
    {
        var result = await sender.Send(new GetUserByIdQuery(id));
        return result != null ? TypedResults.Ok(result) : TypedResults.NotFound();
    }

    private static async Task<Results<Created<UserDto>, NotFound>> CreateUser(UserPayloadDto payload, ISender sender)
    {
        var result = await sender.Send(payload);
        return TypedResults.Created($"/api/users/{result.Id}", result);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateUser(Guid id, UserPayloadDto payload, ISender sender)
    {
        await sender.Send(new UpdateUserCommand(id, payload));
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteUser(Guid id, ISender sender)
    {
        await sender.Send(new DeleteUserCommand(id));
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> ActivateUser(Guid id, ISender sender)
    {
        await sender.Send(new ToggleUserStateCommand(id, true));
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> DeactivateUser(Guid id, ISender sender)
    {
        await sender.Send(new ToggleUserStateCommand(id, false));
        return TypedResults.NoContent();
    }
}
