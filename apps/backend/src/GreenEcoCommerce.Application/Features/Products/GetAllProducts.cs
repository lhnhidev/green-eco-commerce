using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products;

public record GetAllProductsQuery : IRequest<List<ProductDto>>;

public class GetAllProductsHandler(IProductRepository productRepository, IMapper mapper)
    : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
{
    public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken ct)
    {
        var products = await productRepository.GetAllAsync(ct);
        return mapper.Map<List<ProductDto>>(products);
    }
}
