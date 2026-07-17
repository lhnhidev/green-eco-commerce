using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Categories.Queries;

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDto?>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
    {
        public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken ct)
        {
            var category = await dbContext.Categories.Where(c => c.Id == request.Id).ProjectToDto()
                    .FirstOrDefaultAsync(ct);
            return category;
        }
    }

    public class Validator : AbstractValidator<GetCategoryByIdQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Category ID must be a valid GUID.");
        }
    }
}
