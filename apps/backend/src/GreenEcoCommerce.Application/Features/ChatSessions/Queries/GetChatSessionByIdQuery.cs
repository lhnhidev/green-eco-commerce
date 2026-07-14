using FluentValidation;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Queries;

public record GetChatSessionByIdQuery(Guid Id, Guid UserId) : IRequest<ChatSessionDto>
{
    public class Handler(IChatSessionRepository chatSessionRepository)
            : IRequestHandler<GetChatSessionByIdQuery, ChatSessionDto>
    {
        public async Task<ChatSessionDto> Handle(GetChatSessionByIdQuery request, CancellationToken ct)
        {
            var session = await chatSessionRepository.GetByIdAsync(request.Id, request.UserId, ct);

            return session != null ? session.ToDto() : throw new NotFoundException("Not found chat session");
        }
    }

    public class Validator : AbstractValidator<GetChatSessionByIdQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Chat session ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Chat session ID must be a valid GUID.");

            RuleFor(x => x.UserId)
                    .NotEmpty().WithMessage("User ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("User ID must be a valid GUID.");
        }
    }
}
