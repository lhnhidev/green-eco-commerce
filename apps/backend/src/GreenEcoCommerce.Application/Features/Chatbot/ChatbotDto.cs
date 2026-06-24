namespace GreenEcoCommerce.Application.Features.Chatbot;

public enum ChatRole
{
    User,
    Bot
}

public record ChatMessageDto(ChatRole Role, string Content);

public record HistoryChatInSection(ChatRole Role, string Content);
