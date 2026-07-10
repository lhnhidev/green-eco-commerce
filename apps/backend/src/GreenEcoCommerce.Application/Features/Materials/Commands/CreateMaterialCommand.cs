using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public record CreateMaterialCommand(
    string Name,
    string Type,
    int EcoRating,
    string? Origin = null,
    string? Sku = null,
    decimal StockQty = 0,
    string? Unit = null,
    decimal UnitPrice = 0,
    string? ImageUrl = null) : IRequest<CreateMaterialResponse>;

public class CreateMaterialResponseHandler(IMaterialRepository materialRepository, IMapper mapper) : IRequestHandler<CreateMaterialCommand, CreateMaterialResponse>
{
    public async Task<CreateMaterialResponse> Handle(CreateMaterialCommand command, CancellationToken cancellationToken)
    {
        var material = mapper.Map<Material>(command);
        await materialRepository.AddAsync(material, cancellationToken);

        return mapper.Map<CreateMaterialResponse>(material);
    }
}
