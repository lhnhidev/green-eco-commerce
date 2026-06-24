using FluentValidation;
using GreenEcoCommerce.Application.Features.ChatSessions.Commands;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Validators;

public class DeleteChatSessionCommandValidator : AbstractValidator<DeleteChatSessionCommand>
{
    public DeleteChatSessionCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Chat session ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("Chat session ID must be a valid GUID.");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("User ID must be a valid GUID.");
    }
}
