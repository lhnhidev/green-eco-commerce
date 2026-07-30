using GreenEcoCommerce.Application.Features.Chatbot;

namespace GreenEcoCommerce.Application.Interfaces.Chatbot;

public interface IAIService
{
    Task<string> GenerateContentAsync(string prompt, List<HistoryChatInSection> history, string? systemInstruction = null, CancellationToken ct = default);
    Task<float[]> GetEmbeddingsAsync(string text, CancellationToken ct = default);
}
