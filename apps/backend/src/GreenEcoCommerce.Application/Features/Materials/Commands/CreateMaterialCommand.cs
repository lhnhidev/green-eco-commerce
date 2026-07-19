using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public class CreateMaterialCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<MaterialPayloadDto, MaterialDto>
{
    public async Task<MaterialDto> Handle(MaterialPayloadDto command, CancellationToken ct)
    {
        var material = command.ToEntity();

        await dbContext.Materials.AddAsync(material, ct);
        await dbContext.SaveChangesAsync(ct);

        return material.ToDto();
    }
}
