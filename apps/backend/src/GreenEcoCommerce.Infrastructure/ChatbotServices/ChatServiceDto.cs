namespace GreenEcoCommerce.Infrastructure.ChatbotServices;

public record ConfigSettingsChatbot(string Name, string ApiKey, string BaseUrl, string Model);

public record GeminiApiContent(string Role, List<GeminiApiPart> Parts);
public record GeminiApiPart(string Text);
public record GeminiApiResponse(List<GeminiCandidate>? Candidates);
public record GeminiCandidate(GeminiApiContent Content);
