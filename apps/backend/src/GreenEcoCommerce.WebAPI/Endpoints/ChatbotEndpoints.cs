using GreenEcoCommerce.Application.Features.Chatbot.Command;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class ChatbotEndpoints
{
    public static void MapChatbotEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/chatbot").WithTags("Chatbot")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", AskChatbot).RequireAuthorization();
    }

    private static async Task<Ok<string>> AskChatbot(GenerateContentCommand command, ISender sender)
    {
        var response = await sender.Send(command);
        return TypedResults.Ok(response);
    }
}
