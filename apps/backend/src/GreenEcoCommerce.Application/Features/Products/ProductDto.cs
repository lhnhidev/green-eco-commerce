using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

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
    string[] ImageUrl
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
    string[] ImageUrl,
    bool IsActive
);

public class ProductDtoProfile : Profile
{
    public ProductDtoProfile()
    {
        CreateMap<ProductPayloadDto, Product>();
        CreateMap<Product, ProductDto>();
    }
}
