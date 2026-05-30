using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories;

public record UpdateCategoryCommand(Guid Id, CategoryPayloadDto Dto)
        : IRequest<CategoryDto>;

public class UpdateCategoryProfile : Profile
{
    public UpdateCategoryProfile()
    {
        CreateMap<UpdateCategoryCommand, Category>().IncludeMembers(src => src.Dto);
    }
}

public class UpdateCategoryHandler(ICategoryRepository categoryRepository, IMapper mapper)
        : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    public async Task<CategoryDto> Handle(UpdateCategoryCommand command, CancellationToken ct)
    {
        bool found = await categoryRepository.UpdateAsync(mapper.Map<Category>(command), ct);
        return found ? mapper.Map<CategoryDto>(command) : throw new NotFoundException($"Category with ID {command.Id} not found.");
    }
}
