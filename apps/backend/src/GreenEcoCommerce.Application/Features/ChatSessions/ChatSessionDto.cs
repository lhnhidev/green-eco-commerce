using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.ChatSessions;

public record ChatSessionPayloadDto(string Title)
{
    public class Validator : AbstractValidator<ChatSessionPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.Title)
                    .NotEmpty().WithMessage("Chat session title is required.")
                    .MinimumLength(2).WithMessage("Chat session title must be at least 2 characters long.")
                    .MaximumLength(255).WithMessage("Chat session title must not exceed 255 characters.");
        }
    }
}

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
