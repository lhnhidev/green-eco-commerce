using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories;

public record CategoryPayloadDto(string Name, string? Description = null, Guid? ParentId = null): IRequest<CategoryDto>;

public record CategoryDto(
    Guid Id,
    string Name,
    string? Description = null,
    Guid? ParentId = null
): CategoryPayloadDto(Name, Description, ParentId);

public class CategoryDtoProfile : Profile
{
    public CategoryDtoProfile()
    {
        CreateMap<CategoryPayloadDto, Category>();
        CreateMap<Category, CategoryDto>();
    }
}
