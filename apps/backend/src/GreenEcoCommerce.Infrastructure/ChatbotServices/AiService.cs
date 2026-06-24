using System.Net.Http.Json;
using System.Text.Json;
using GreenEcoCommerce.Application.Interfaces.Chatbot;
using GreenEcoCommerce.Application.Features.Chatbot;
using GreenEcoCommerce.Domain.Exceptions;
using Microsoft.Extensions.Configuration;

namespace GreenEcoCommerce.Infrastructure.ChatbotServices;

public class AiService(HttpClient httpClient, IConfiguration configuration) : IAiService
{
    private readonly ConfigSettingsChatbot _settings = new ConfigSettingsChatbot
    (
        "models/gemini",
        configuration["Chatbot:ApiKey"] ?? string.Empty,
        configuration["Chatbot:BaseUrl"] ?? "https://generativelanguage.googleapis.com",
        configuration["Chatbot:Model"] ?? "gemini-1.5-flash" // fallback về 1.5 nếu config trống
    );

    public async Task<string> GenerateContentAsync(string prompt, List<HistoryChatInSection> history,
        CancellationToken cancellationToken = default)
    {
        // Transform history + prompt sang format Gemini
        var contents = history
            .Select(h => new
            {
                role = h.Role == ChatRole.Bot ? "model" : "user",
                parts = new[] { new { text = h.Content } }
            })
            .Append(new
            {
                role = "user",
                parts = new[] { new { text = prompt } }
            })
            .ToList<object>();

        var body = new { contents };

        var url = $"/v1beta/models/{_settings.Model}:generateContent?key={_settings.ApiKey}";

        var response = await httpClient.PostAsJsonAsync(url, body, cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<GeminiApiResponse>(
                         cancellationToken: cancellationToken)
                     ?? throw new OverviewException("Empty response from Chatbot.");

        return result.Candidates? .FirstOrDefault()?.Content.Parts.FirstOrDefault()?.Text
               ?? throw new OverviewException("No content returned.");
    }
}
