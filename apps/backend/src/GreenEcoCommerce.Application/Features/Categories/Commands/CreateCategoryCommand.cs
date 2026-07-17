using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public class CreateCategoryHandler(IApplicationDbContext dbContext, ICategoryRepository categoryRepository)
        : IRequestHandler<CategoryPayloadDto, CategoryDto>
{
    public async Task<CategoryDto> Handle(CategoryPayloadDto command, CancellationToken ct)
    {
        var category = await categoryRepository.AddAsync(command.ToEntity(), ct);
        return await dbContext.Categories.Where(c => c.Id == category.Id).ProjectToDto().FirstAsync(ct);
    }
}
