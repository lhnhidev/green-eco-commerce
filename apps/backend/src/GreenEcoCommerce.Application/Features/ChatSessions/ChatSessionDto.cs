using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.ChatSessions;

public record ChatSessionPayloadDto(string Title);

public record ChatSessionDto(
    Guid Id,
    Guid UserId,
    string Title,
    DateTimeOffset CreatedAt
);

[Mapper]
public static partial class ChatSessionDtoMapper
{
    public static partial ChatSessionDto ToDto(this ChatSession chatSession);
    public static partial ChatSession ToEntity(this ChatSessionPayloadDto payload);
}
