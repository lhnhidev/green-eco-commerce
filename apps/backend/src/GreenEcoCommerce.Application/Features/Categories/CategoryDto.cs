using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Categories;

public record CategoryPayloadDto(string Name, string? Description = null, Guid? ParentId = null) : IRequest<CategoryDto>
{
    public class Validator : AbstractValidator<CategoryPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.Name)
                    .NotEmpty().WithMessage("Category name is required.")
                    .MinimumLength(2).WithMessage("Category name must be at least 2 characters long.")
                    .MaximumLength(150).WithMessage("Category name must not exceed 150 characters.");

            RuleFor(x => x.Description)
                    .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.")
                    .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.ParentId)
                    .NotEmpty().WithMessage("Parent ID must be a valid GUID if provided.")
                    .When(x => x.ParentId.HasValue);
        }
    }
}

public record CategoryDto(Guid Id, string Name, int ProductCount, string? Description = null, Guid? ParentId = null)
        : CategoryPayloadDto(Name, Description, ParentId);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public static partial class CategoryDtoMapper
{
    [MapperRequiredMapping(RequiredMappingStrategy.Target)]
    [MapProperty(nameof(Category), nameof(CategoryDto.ProductCount), Use = nameof(MapCategoryToTotalProductCount))]
    public static partial CategoryDto ToDto(this Category category);
    public static partial IQueryable<CategoryDto> ProjectToDto(this IQueryable<Category> q);

    private static int MapCategoryToTotalProductCount(Category category)
        => category.Products.Count(p => p.IsActive) + category.ChildCategories.Sum(sub => sub.Products.Count(p => p.IsActive));
    public static partial Category ToEntity(this CategoryPayloadDto payload);
    public static partial void ApplyUpdate([MappingTarget] this Category category, CategoryPayloadDto payload);
}
