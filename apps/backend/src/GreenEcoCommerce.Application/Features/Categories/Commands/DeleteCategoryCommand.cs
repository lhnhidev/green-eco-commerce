using FluentValidation;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public record DeleteCategoryCommand(Guid Id) : IRequest
{
    public class Handler(ICategoryRepository categoryRepository) : IRequestHandler<DeleteCategoryCommand>
    {
        public async Task Handle(DeleteCategoryCommand command, CancellationToken ct)
        {
            await categoryRepository.DeleteAsync(command.Id, ct);
        }
    }

    public class Validator : AbstractValidator<DeleteCategoryCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Category ID must be a valid GUID.");
        }
    }
}
