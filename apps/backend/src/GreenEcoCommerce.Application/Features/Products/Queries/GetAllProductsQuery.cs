using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record GetAllProductsQuery : IRequest<ProductDto[]>
{
    public class Handler(IProductRepository productRepository) : IRequestHandler<GetAllProductsQuery, ProductDto[]>
    {
        public async Task<ProductDto[]> Handle(GetAllProductsQuery request, CancellationToken ct)
        {
            var products = await productRepository.GetAllAsync(ct);
            return products.Select(ProductDtoMapper.ToDto).ToArray();
        }
    }
}
