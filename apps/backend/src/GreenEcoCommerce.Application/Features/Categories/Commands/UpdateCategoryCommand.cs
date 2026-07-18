using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public partial record UpdateCategoryCommand(Guid Id, CategoryPayloadDto Dto) : IRequest<CategoryDto>
{
    public class Handler(ICategoryRepository categoryRepository, IApplicationDbContext dbContext)
            : IRequestHandler<UpdateCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(UpdateCategoryCommand command, CancellationToken ct)
        {
            bool found = await categoryRepository.UpdateAsync(Mapper.ToEntity(command), ct);
            return found
                    ? await dbContext.Categories.Where(c => c.Id == command.Id).ProjectToDto().FirstAsync(ct)
                    : throw new NotFoundException($"Category with ID {command.Id} not found.");
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        [MapNestedProperties(nameof(Dto))]
        public static partial Category ToEntity(UpdateCategoryCommand command);
    }

    public class Validator : AbstractValidator<UpdateCategoryCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Category ID must be a valid GUID.");

            RuleFor(x => x.Dto).SetValidator(new CategoryPayloadDto.Validator());
        }
    }
}
