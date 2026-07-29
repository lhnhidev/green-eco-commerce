using Google.GenAI;
using Google.GenAI.Types;
using GreenEcoCommerce.Application.Interfaces.Chatbot;
using GreenEcoCommerce.Application.Features.Chatbot;
using GreenEcoCommerce.Domain.Exceptions;
using Microsoft.Extensions.Configuration;

namespace GreenEcoCommerce.Infrastructure.ChatbotServices;

public class AIService(IConfiguration configuration) : IAIService
{
    private readonly Client client = new(apiKey: configuration["Chatbot:ApiKey"] ?? string.Empty);

    private readonly string
            chatbotModel = configuration["Chatbot:Model"] ?? "gemini-2.5-flash"; // fallback về 2.5 nếu config trống

    private const string EmbeddingModel = "gemini-embedding-2";

    public async Task<string> GenerateContentAsync(string prompt, List<HistoryChatInSection> history,
                                                   string? systemInstruction = null, CancellationToken ct = default)
    {
        // Transform history + prompt sang format Gemini
        List<Content> contents =
        [
            .. history.Select(h => new Content
            {
                Role = h.Role == ChatRole.Bot ? "model" : "user",
                Parts = [new Part { Text = h.Content }]
            }),
            new()
            {
                Role = "user",
                Parts = [new Part { Text = prompt }]
            }
        ];

        var config = new GenerateContentConfig
        {
            ThinkingConfig = new ThinkingConfig
            {
                ThinkingLevel = ThinkingLevel.Low
            }
        };

        if (!string.IsNullOrWhiteSpace(systemInstruction))
        {
            config.SystemInstruction = new Content { Parts = [new Part { Text = systemInstruction }] };
        }

        var response = await client.Models.GenerateContentAsync(
            chatbotModel,
            contents,
            config,
            ct);

        return response.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text ??
               throw new OverviewException("No content returned.");
    }

    public async Task<float[]> GetEmbeddingsAsync(string text, CancellationToken ct = default)
    {
        var response = await client.Models.EmbedContentAsync(
            EmbeddingModel,
            new Content
            {
                Parts = [new Part { Text = text }]
            },
            new EmbedContentConfig
            {
                OutputDimensionality = 1536
            },
            ct);

        var embedding = response.Embeddings?.FirstOrDefault();

        if (embedding?.Values is null) { throw new OverviewException("No embedding returned."); }

        if (embedding.Values.Count != 1536)
        {
            throw new OverviewException($"Embedding returned has unexpected dimensionality: {embedding.Values.Count}");
        }

        return [.. embedding.Values.Select(v => (float)v)];
    }
}
