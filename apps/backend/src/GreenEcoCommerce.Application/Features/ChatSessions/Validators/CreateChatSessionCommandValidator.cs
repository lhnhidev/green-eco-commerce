using FluentValidation;
using GreenEcoCommerce.Application.Features.ChatSessions.Commands;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Validators;

public class CreateChatSessionCommandValidator : AbstractValidator<CreateChatSessionCommand>
{
    public CreateChatSessionCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("User ID must be a valid GUID.");

        RuleFor(x => x.Dto.Title)
            .NotEmpty().WithMessage("Chat session title is required.")
            .MinimumLength(2).WithMessage("Chat session title must be at least 2 characters long.")
            .MaximumLength(255).WithMessage("Chat session title must not exceed 255 characters.");
    }
}
