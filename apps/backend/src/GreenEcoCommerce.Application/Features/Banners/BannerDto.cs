using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Banners;

public record BannerPayloadDto(
    string Title,
    string? Subtitle,
    string ImageUrl,
    string? LinkUrl,
    int SortOrder,
    bool IsActive
) : IRequest<BannerDto>;

public record BannerDto(
    Guid Id,
    string Title,
    string? Subtitle,
    string ImageUrl,
    string? LinkUrl,
    int SortOrder,
    bool IsActive,
    DateTimeOffset CreatedAt
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public static partial class BannerDtoMapper
{
    public static partial BannerDto ToDto(this Banner banner);
    public static partial IQueryable<BannerDto> ProjectToDto(this IQueryable<Banner> banners);

    public static partial Banner ToEntity(this BannerPayloadDto payload);
    public static partial void ApplyUpdate([MappingTarget] this Banner banner, BannerPayloadDto payload);
}
