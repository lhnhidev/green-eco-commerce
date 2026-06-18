using FluentValidation;
using GreenEcoCommerce.Application.Features.ChatSessions.Queries;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Validators;

public class GetChatSessionByIdQueryValidator : AbstractValidator<GetChatSessionByIdQuery>
{
    public GetChatSessionByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Chat session ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("Chat session ID must be a valid GUID.");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("User ID must be a valid GUID.");
    }
}
