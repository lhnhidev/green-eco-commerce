using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Products.Commands;

public partial record UpdateProductCommand(Guid Id, ProductPayloadDto Dto) : IRequest<ProductDto>
{
    public class Handler(IProductRepository productRepository) : IRequestHandler<UpdateProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(UpdateProductCommand command, CancellationToken ct)
        {
            var product = Mapper.ToEntity(command);
            bool found = await productRepository.UpdateAsync(product, ct);
            return found ? product.ToDto() : throw new NotFoundException($"Product with ID {command.Id} not found.");
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        [MapNestedProperties(nameof(Dto))]
        public static partial Product ToEntity(UpdateProductCommand command);
    }

    public class Validator : AbstractValidator<UpdateProductCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Product ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Product ID must be a valid GUID.");

            RuleFor(x => x.Dto.Name)
                    .NotEmpty().WithMessage("Product name is required.")
                    .MaximumLength(255).WithMessage("Product name must not exceed 255 characters.");

            RuleFor(x => x.Dto.Price)
                    .GreaterThan(0).WithMessage("Price must be greater than 0.");

            RuleFor(x => x.Dto.StockQty)
                    .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");

            RuleFor(x => x.Dto.CategoryId)
                    .NotEmpty().WithMessage("Category ID is required.");
        }
    }
}
