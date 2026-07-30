using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Chatbot.Commands;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class ChatbotEndpoints
{
    public static void MapChatbotEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/chatbot").WithTags("Chatbot")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", AskChatbot).RequireAuthorization();
    }

    public record AskChatbotRequest(Guid? IdSectionMessage, string Prompt);

    private static async Task<Ok<GenerateContentCommand.Response>> AskChatbot(
        [FromBody] AskChatbotRequest request, ClaimsPrincipal user, ISender sender)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) throw new UnauthorizedAccessException();

        var response = await sender.Send(new GenerateContentCommand(userId, request.IdSectionMessage, request.Prompt));
        return TypedResults.Ok(response);
    }
}
