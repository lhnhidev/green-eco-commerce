using GreenEcoCommerce.Application.Interfaces.Chatbot;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Chatbot.Command;

public record GenerateContentCommand(Guid? IdSectionMessage, string Prompt) : IRequest<string>;

public class GenerateContentCommandHandler(IAiService aiService) : IRequestHandler<GenerateContentCommand, string>
{
    public async Task<string> Handle(GenerateContentCommand request, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(request.Prompt))
        {
            throw new BadRequestException("Prompt must not be empty.");
        }

        // Sau này dùng repo lấy history, hiện tại để rỗng
        var historyChatInSection = new List<HistoryChatInSection>();

        try
        {
            string text = await aiService.GenerateContentAsync(request.Prompt, historyChatInSection, ct);

            // Sau này lưu vào db ở đây

            return text;
        }
        catch (Exception ex)
        {
            throw new OverviewException($"Error generating content: {ex.Message}");
        }
    }
}
