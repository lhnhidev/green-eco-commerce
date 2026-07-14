using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Queries;

public record GetAllMaterialsQuery : IRequest<MaterialItem[]>
{
    public class Handler(IMaterialRepository materialRepository) : IRequestHandler<GetAllMaterialsQuery, MaterialItem[]>
    {
        public async Task<MaterialItem[]> Handle(GetAllMaterialsQuery request, CancellationToken ct)
        {
            var materials = await materialRepository.GetAllAsync(ct);
            return materials.Select(MaterialDtoMapper.ToDto).ToArray();
        }
    }
}
