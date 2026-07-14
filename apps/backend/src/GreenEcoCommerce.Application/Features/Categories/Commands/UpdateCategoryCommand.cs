using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public partial record UpdateCategoryCommand(Guid Id, CategoryPayloadDto Dto) : IRequest<CategoryDto>
{
    public class Handler(ICategoryRepository categoryRepository)
            : IRequestHandler<UpdateCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(UpdateCategoryCommand command, CancellationToken ct)
        {
            bool found = await categoryRepository.UpdateAsync(Mapper.ToEntity(command), ct);
            return found
                    ? Mapper.ToDto(command)
                    : throw new NotFoundException($"Category with ID {command.Id} not found.");
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        [MapNestedProperties(nameof(Dto))]
        public static partial Category ToEntity(UpdateCategoryCommand command);

        [MapNestedProperties(nameof(Dto))]
        public static partial CategoryDto ToDto(UpdateCategoryCommand command);
    }

    public class Validator : AbstractValidator<UpdateCategoryCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Category ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Category ID must be a valid GUID.");

            RuleFor(x => x.Dto.Name)
                    .NotEmpty().WithMessage("Category name is required.")
                    .MinimumLength(2).WithMessage("Category name must be at least 2 characters long.")
                    .MaximumLength(100).WithMessage("Category name must not exceed 100 characters.");

            RuleFor(x => x.Dto.Description)
                    .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
                    .When(x => !string.IsNullOrEmpty(x.Dto.Description));

            RuleFor(x => x.Dto.ParentId)
                    .NotNull().WithMessage("Parent ID must be a valid GUID if provided.")
                    .When(x => x.Dto.ParentId.HasValue);
        }
    }
}
