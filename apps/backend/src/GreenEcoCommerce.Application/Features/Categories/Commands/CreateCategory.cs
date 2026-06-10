using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public class CreateCategoryHandler(ICategoryRepository categoryRepository, IMapper mapper)
        : IRequestHandler<CategoryPayloadDto, CategoryDto>
{
    public async Task<CategoryDto> Handle(CategoryPayloadDto command, CancellationToken ct)
    {
        var category = await categoryRepository.AddAsync(mapper.Map<Category>(command), ct);

        return mapper.Map<CategoryDto>(category);
    }
}
