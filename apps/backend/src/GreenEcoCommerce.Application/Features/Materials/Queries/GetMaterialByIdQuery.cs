using AutoMapper;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Queries;

public record GetMaterialByIdQuery(Guid Id) : IRequest<MaterialItem>;

public class GetMaterialByIdQueryHandler(IMaterialRepository materialRepository, IMapper mapper) : IRequestHandler<GetMaterialByIdQuery, MaterialItem>
{
    public async Task<MaterialItem> Handle(GetMaterialByIdQuery request, CancellationToken cancellationToken)
    {
        var materialItem = await materialRepository.GetByIdAsync(request.Id);

        return (materialItem == null)
            ? throw new NotFoundException("Material not found")
            : mapper.Map<MaterialItem>(materialItem);
    }
}
