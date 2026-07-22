using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public record UpdateCategoryCommand(Guid Id, CategoryPayloadDto Dto) : IRequest<CategoryDto>
{
    public class Handler(IApplicationDbContext dbContext)
            : IRequestHandler<UpdateCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(UpdateCategoryCommand command, CancellationToken ct)
        {
            if (command.Dto.ParentId.HasValue)
            {
                var parentCategory = await dbContext.Categories.FindAsync([command.Dto.ParentId.Value], ct) ??
                                     throw new NotFoundException($"Parent category with ID {command.Dto.ParentId.Value} not found.");

                if (parentCategory.ParentId.HasValue)
                {
                    throw new BadRequestException("Parent category must be a top-level category.");
                }
            }

            var category = await dbContext.Categories.FindAsync([command.Id], ct) ??
                           throw new NotFoundException($"Category with ID {command.Id} not found.");

            category.ApplyUpdate(command.Dto);
            await dbContext.SaveChangesAsync(ct);

            return category.ToDto();
        }
    }

    public class Validator : AbstractValidator<UpdateCategoryCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Dto).SetValidator(new CategoryPayloadDto.Validator());
        }
    }
}
