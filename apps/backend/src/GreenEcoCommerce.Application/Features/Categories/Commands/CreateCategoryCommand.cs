using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public class CreateCategoryHandler(IApplicationDbContext dbContext) : IRequestHandler<CategoryPayloadDto, CategoryDto>
{
    public async Task<CategoryDto> Handle(CategoryPayloadDto command, CancellationToken ct)
    {
        var category = command.ToEntity();

        await dbContext.Categories.AddAsync(category, ct);
        await dbContext.SaveChangesAsync(ct);

        return category.ToDto();
    }
}
