using GreenEcoCommerce.Application.Features.Materials;
using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Products;

public record ProductPayloadDto(
    string Name,
    string? Description,
    decimal Price,
    int StockQty,
    Guid CategoryId,
    float CarbonIndex,
    float BaselineCarbonIndex,
    float DecomposePercent,
    float RecyclePercent,
    ICollection<string> ImageUrl,
    ICollection<Guid> MaterialIds
) : IRequest<ProductDto>;

public record ProductDto(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQty,
    Guid CategoryId,
    float CarbonIndex,
    float BaselineCarbonIndex,
    float DecomposePercent,
    float RecyclePercent,
    ICollection<string> ImageUrl,
    ICollection<MaterialItem> Materials,
    bool IsActive
);

[Mapper]
public static partial class ProductDtoMapper
{
    public static partial ProductDto ToDto(this Product product);
    [MapperIgnoreSource(nameof(ProductDto.Materials))]
    public static partial Product ToEntity(this ProductPayloadDto payload);
}
