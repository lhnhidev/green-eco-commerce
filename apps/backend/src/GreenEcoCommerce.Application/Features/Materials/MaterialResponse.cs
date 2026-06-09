using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials;

public record CreateMaterialResponse(string Name, MaterialTypeEnum Type, int EcoRating);

public class CreateMaterialResponseHandler(IMaterialRepository materialRepository) : IRequestHandler<CreateMaterialCommand, CreateMaterialResponse>
{
    public Task<CreateMaterialResponse> Handle(CreateMaterialCommand request, CancellationToken cancellationToken)
    {

        throw new NotImplementedException();
    }
}
