using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials;

public record CreateMaterialCommand() : IRequest<CreateMaterialResponse>;


