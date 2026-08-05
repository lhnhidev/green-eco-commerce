using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Materials.Queries;

public record GetMaterialByIdQuery(Guid Id) : IRequest<MaterialDto?>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetMaterialByIdQuery, MaterialDto?>
    {
        public async Task<MaterialDto?> Handle(GetMaterialByIdQuery request, CancellationToken ct)
        {
            var material = await dbContext.Materials.WithId(request.Id).ProjectToDto().FirstOrDefaultAsync(ct);
            return material;
        }
    }
}
