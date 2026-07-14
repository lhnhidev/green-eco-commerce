using FluentValidation;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>
{
    public class Handler(IProductRepository productRepository) : IRequestHandler<GetProductByIdQuery, ProductDto>
    {
        public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken ct)
        {
            var product = await productRepository.GetByIdAsync(request.Id, ct);
            return product != null ? product.ToDto() : throw new NotFoundException("Product not found");
        }
    }

    public class Validator : AbstractValidator<GetProductByIdQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Product ID is required.").Must(id => id != Guid.Empty)
                    .WithMessage("Product ID must be a valid GUID.");
        }
    }
}
