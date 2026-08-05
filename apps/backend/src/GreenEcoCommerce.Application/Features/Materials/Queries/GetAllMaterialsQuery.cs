using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Materials.Queries;

public record GetAllMaterialsQuery : IRequest<MaterialDto[]>
{
    public class Handler(IApplicationDbContext context) : IRequestHandler<GetAllMaterialsQuery, MaterialDto[]>
    {
        public async Task<MaterialDto[]> Handle(GetAllMaterialsQuery request, CancellationToken ct)
        {
            var materials = await context.Materials.ProjectToDto().ToArrayAsync(ct);
            return materials;
        }
    }
}
