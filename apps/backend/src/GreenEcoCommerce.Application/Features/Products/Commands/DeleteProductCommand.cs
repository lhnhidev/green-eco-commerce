using FluentValidation;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Commands;

public record DeleteProductCommand(Guid Id) : IRequest
{
    public class Handler(IProductRepository productRepository) : IRequestHandler<DeleteProductCommand>
    {
        public async Task Handle(DeleteProductCommand command, CancellationToken ct)
        {
            await productRepository.DeleteAsync(command.Id, ct);
        }
    }

    public class Validator : AbstractValidator<DeleteProductCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Product ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Product ID must be a valid GUID.");
        }
    }
}
