using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Categories.Queries;

public record GetAllCategoriesQuery : IRequest<CategoryDto[]>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetAllCategoriesQuery, CategoryDto[]>
    {
        public async Task<CategoryDto[]> Handle(GetAllCategoriesQuery request, CancellationToken ct)
        {
            var categories = await dbContext.Categories.ProjectToDto().ToArrayAsync(ct);
            return categories;
        }
    }
}
