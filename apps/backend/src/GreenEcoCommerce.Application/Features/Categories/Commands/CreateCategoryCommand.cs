using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public class CreateCategoryHandler(IApplicationDbContext dbContext) : IRequestHandler<CategoryPayloadDto, CategoryDto>
{
    public async Task<CategoryDto> Handle(CategoryPayloadDto command, CancellationToken ct)
    {
        if (command.ParentId.HasValue)
        {
            var parentCategory = await dbContext.Categories.FindAsync([command.ParentId.Value], ct) ??
                                 throw new NotFoundException($"Parent category with ID {command.ParentId.Value} not found.");

            if (parentCategory.ParentId.HasValue)
            {
                throw new BadRequestException("Parent category must be a top-level category.");
            }
        }

        var category = command.ToEntity();

        await dbContext.Categories.AddAsync(category, ct);
        await dbContext.SaveChangesAsync(ct);

        return category.ToDto();
    }
}
