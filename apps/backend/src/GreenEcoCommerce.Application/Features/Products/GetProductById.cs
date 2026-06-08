using AutoMapper;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;

public class GetProductByIdHandler(IProductRepository productRepository, IMapper mapper)
    : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken ct)
    {
        var product = await productRepository.GetByIdAsync(request.Id, ct);
        return product != null
            ? mapper.Map<ProductDto>(product)
            : throw new NotFoundException("Product not found");
    }
}
