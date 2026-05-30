using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories;

public record GetAllCategoriesQuery : IRequest<List<CategoryDto>>;

public class GetAllCategoriesHandler(ICategoryRepository categoryRepository, IMapper mapper)
        : IRequestHandler<GetAllCategoriesQuery, List<CategoryDto>>
{
    public async Task<List<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken ct)
    {
        var categories = await categoryRepository.GetAllAsync(ct);
        return mapper.Map<List<CategoryDto>>(categories);
    }
}
