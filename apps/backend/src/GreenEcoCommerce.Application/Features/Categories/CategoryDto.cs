using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Categories;

public record CategoryPayloadDto(string Name, string? Description = null, Guid? ParentId = null): IRequest<CategoryDto>;

public record CategoryDto(
    Guid Id,
    string Name,
    string? Description = null,
    Guid? ParentId = null
): CategoryPayloadDto(Name, Description, ParentId);

[Mapper]
public static partial class CategoryDtoMapper
{
    public static partial CategoryDto ToDto(this Category category);
    public static partial Category ToEntity(this CategoryPayloadDto payload);
}
