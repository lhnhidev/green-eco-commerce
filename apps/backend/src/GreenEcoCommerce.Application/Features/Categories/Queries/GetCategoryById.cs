using FluentValidation;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories.Queries;

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDto?>
{
    public class Handler(ICategoryRepository categoryRepository)
            : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
    {
        public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken ct)
        {
            var category = await categoryRepository.GetByIdAsync(request.Id, ct);
            return category?.ToDto();
        }
    }

    public class Validator : AbstractValidator<GetCategoryByIdQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Category ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Category ID must be a valid GUID.");
        }
    }
}
