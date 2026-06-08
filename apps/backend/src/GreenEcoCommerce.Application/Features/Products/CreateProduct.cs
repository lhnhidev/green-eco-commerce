using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products;

public record CreateProductCommand(
    string Name,
    string? Description,
    decimal Price,
    int StockQty,
    Guid CategoryId,
    float CarbonIndex,
    float BaselineCarbonIndex,
    float DecomposePercent,
    float RecyclePercent,
    string? ImageUrl
) : IRequest<ProductDto>;

public class CreateProductHandler(IProductRepository productRepository, IMapper mapper)
    : IRequestHandler<CreateProductCommand, ProductDto>
{
    public async Task<ProductDto> Handle(CreateProductCommand command, CancellationToken ct)
    {
        var product = mapper.Map<Product>(command);
        var created = await productRepository.AddAsync(product, ct);
        return mapper.Map<ProductDto>(created);
    }
}
