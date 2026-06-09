using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Queries;

public record GetAllMaterialsQuery : IRequest<List<MaterialItem>>;

public class GetAllMaterialQueryHandler(IMaterialRepository materialRepository, IMapper mapper) : IRequestHandler<GetAllMaterialsQuery, List<MaterialItem>>
{
    public async Task<List<MaterialItem>> Handle(GetAllMaterialsQuery request, CancellationToken ct)
    {
        var materials = await materialRepository.GetAllAsync(ct);
        return mapper.Map<List<MaterialItem>>(materials);
    }
}
