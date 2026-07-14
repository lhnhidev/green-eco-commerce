using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories.Queries;

public record GetAllCategoriesQuery : IRequest<CategoryDto[]>
{
    public class Handler(ICategoryRepository categoryRepository) : IRequestHandler<GetAllCategoriesQuery, CategoryDto[]>
    {
        public async Task<CategoryDto[]> Handle(GetAllCategoriesQuery request, CancellationToken ct)
        {
            var categories = await categoryRepository.GetAllAsync(ct);
            return categories.Select(CategoryDtoMapper.ToDto).ToArray();
        }
    }
}
