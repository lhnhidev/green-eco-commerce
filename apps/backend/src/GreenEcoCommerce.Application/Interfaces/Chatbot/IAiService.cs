using GreenEcoCommerce.Application.Features.Chatbot;

namespace GreenEcoCommerce.Application.Interfaces.Chatbot;

public interface IAiService
{
    Task<string> GenerateContentAsync( string prompt, List<HistoryChatInSection> history, CancellationToken cancellationToken = default);
}
