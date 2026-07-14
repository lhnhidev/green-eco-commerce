using GreenEcoCommerce.Application.Features.Materials.Commands;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Materials;

public record MaterialItem(
    Guid Id,
    string Name,
    MaterialTypeEnum Type,
    int EcoRating);

public record MaterialPayloadDto(
    string Name,
    MaterialTypeEnum Type,
    int EcoRating): IRequest<MaterialItem>;

[Mapper]
public static partial class MaterialDtoMapper
{
    public static partial MaterialItem ToDto(this Material material);
    public static partial Material ToEntity(this MaterialPayloadDto dto);
}
