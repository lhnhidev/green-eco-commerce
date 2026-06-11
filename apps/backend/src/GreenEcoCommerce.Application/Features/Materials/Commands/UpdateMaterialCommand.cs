using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public record UpdateMaterialCommand(Guid Id, MaterialUpdateDto Dto) : IRequest<MaterialItem>;

public class UpdateMaterialCommandHandler(IMaterialRepository materialRepository, IMapper mapper) : IRequestHandler<UpdateMaterialCommand, MaterialItem>
{
    public async Task<MaterialItem> Handle(UpdateMaterialCommand command, CancellationToken cancellationToken)
    {
        var material = mapper.Map<Material>(command);
        var found = await materialRepository.UpdateAsync(material, cancellationToken);
        return found
            ? mapper.Map<MaterialItem>(material)
            : throw new NotFoundException($"Material with ID {command.Id} not found.");
    }
}
