using AutoMapper;
using GreenEcoCommerce.Application.Features.Materials;
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
)
{
    public ProductDto() : this(default, "", null, 0, 0, default, 0, 0, 0, 0, new List<string>(), new List<MaterialItem>(), false) { }
}

public class ProductDtoProfile : Profile
{
    public ProductDtoProfile()
    {
        CreateMap<ProductPayloadDto, Product>()
            .ForMember(dest => dest.Materials, opt => opt.Ignore())
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl.ToArray()));

        CreateMap<Product, ProductDto>();
    }
}
