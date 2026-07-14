using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record SearchProductQuery(string Name) : IRequest<ProductDto[]>
{
    public class Handler(IProductRepository productRepository) : IRequestHandler<SearchProductQuery, ProductDto[]>
    {
        public async Task<ProductDto[]> Handle(SearchProductQuery query, CancellationToken ct)
        {
            var products = await productRepository.SearchByNameAsync(query.Name, ct);
            return products.Select(ProductDtoMapper.ToDto).ToArray();
        }
    }
}
