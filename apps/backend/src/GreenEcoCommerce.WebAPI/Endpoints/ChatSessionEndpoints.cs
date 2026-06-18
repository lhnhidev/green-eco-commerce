using System.Security.Claims;
using GreenEcoCommerce.Application.Features.ChatSessions;
using GreenEcoCommerce.Application.Features.ChatSessions.Commands;
using GreenEcoCommerce.Application.Features.ChatSessions.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class ChatSessionEndpoints
{
    public static void MapChatSessionEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/chat-sessions").WithTags("ChatSessions")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .RequireAuthorization();

        group.MapGet("/", GetAllChatSessions);
        group.MapGet("/{id:guid}", GetChatSessionById);
        group.MapPost("/", CreateChatSession);
        group.MapPut("/{id:guid}", UpdateChatSession);
        group.MapDelete("/{id:guid}", DeleteChatSession);
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

    private static async Task<Ok<List<ChatSessionDto>>> GetAllChatSessions(ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var sessions = await sender.Send(new GetAllChatSessionsQuery(userId));
        return TypedResults.Ok(sessions);
    }

    private static async Task<Results<Ok<ChatSessionDto>, NotFound>> GetChatSessionById(Guid id, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var session = await sender.Send(new GetChatSessionByIdQuery(id, userId));
        return TypedResults.Ok(session);
    }

    private static async Task<Created<ChatSessionDto>> CreateChatSession(ClaimsPrincipal user, [FromBody] ChatSessionPayloadDto payload, ISender sender)
    {
        var userId = GetUserId(user);
        var created = await sender.Send(new CreateChatSessionCommand(userId, payload));
        return TypedResults.Created($"/chat-sessions/{created.Id}", created);
    }

    private static async Task<NoContent> UpdateChatSession(Guid id, ClaimsPrincipal user, [FromBody] ChatSessionPayloadDto payload, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new UpdateChatSessionCommand(id, userId, payload));
        return TypedResults.NoContent();
    }

    private static async Task<NoContent> DeleteChatSession(Guid id, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new DeleteChatSessionCommand(id, userId));
        return TypedResults.NoContent();
    }
}
