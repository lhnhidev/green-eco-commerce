using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record GetSomeProductsQuery(int PageSize, int PageNumber) : IRequest<List<ProductDto>>;

public class GetSomeProductQueryHanlder(IProductRepository productRepository, IMapper mapper) : IRequestHandler<GetSomeProductsQuery, List<ProductDto>>
{
    public async Task<List<ProductDto>> Handle(GetSomeProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await productRepository.GetSomeAsync(request.PageSize, request.PageNumber, cancellationToken);
        return mapper.Map<List<ProductDto>>(products);
    }
}
