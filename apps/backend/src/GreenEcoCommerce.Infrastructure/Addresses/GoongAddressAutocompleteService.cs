using System.Net.Http.Json;
using System.Text.Json.Serialization;
using GreenEcoCommerce.Application.Interfaces.Addresses;
using Microsoft.Extensions.Configuration;

namespace GreenEcoCommerce.Infrastructure.Addresses;

public class GoongAddressAutocompleteService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        : IAddressAutocompleteService
{
    public async Task<AddressSuggestion[]> SearchAsync(string input, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(input)) { return []; }

        string apiKey = configuration["Goong:ApiKey"] ?? string.Empty;
        var client = httpClientFactory.CreateClient();
        string url = "https://rsapi.goong.io/v2/place/autocomplete" +
                     $"?api_key={Uri.EscapeDataString(apiKey)}" +
                     $"&input={Uri.EscapeDataString(input)}" +
                     "&limit=5&more_compound=true";

        GoongAutocompleteResponse? response;
        try
        {
            response = await client.GetFromJsonAsync<GoongAutocompleteResponse>(url, ct);
        }
        catch (HttpRequestException)
        {
            return [];
        }

        if (response?.Predictions == null) { return []; }

        return response.Predictions
            .Select(p => new AddressSuggestion(
                p.Description,
                p.PlaceId,
                p.StructuredFormatting?.MainText ?? p.Description,
                p.StructuredFormatting?.SecondaryText ?? string.Empty,
                p.Compound?.Commune,
                p.Compound?.Province))
            .ToArray();
    }

    private record Compound(
        [property: JsonPropertyName("commune")] string? Commune,
        [property: JsonPropertyName("province")] string? Province);

    private record StructuredFormatting(
        [property: JsonPropertyName("main_text")] string? MainText,
        [property: JsonPropertyName("secondary_text")] string? SecondaryText);

    private record Prediction(
        [property: JsonPropertyName("description")] string Description,
        [property: JsonPropertyName("place_id")] string PlaceId,
        [property: JsonPropertyName("structured_formatting")] StructuredFormatting? StructuredFormatting,
        [property: JsonPropertyName("compound")] Compound? Compound);

    private record GoongAutocompleteResponse(
        [property: JsonPropertyName("predictions")] Prediction[]? Predictions,
        [property: JsonPropertyName("status")] string? Status);
}
