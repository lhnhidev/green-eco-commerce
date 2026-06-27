using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record SearchProductQuery(string Name) : IRequest<List<ProductDto>>;

public class SearchProductQueryHandler(IProductRepository productRepository, IMapper mapper) : IRequestHandler<SearchProductQuery, List<ProductDto>>
{
    public async Task<List<ProductDto>> Handle(SearchProductQuery query, CancellationToken cancellationToken)
    {
        var products = await productRepository.SearchByNameAsync(query.Name);
        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            Description = p.Description
        }).ToList();
    }
}
