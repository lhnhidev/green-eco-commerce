using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public record DeleteMaterialCommand(Guid Id) : IRequest;

public class DeleteMaterialCommandHandler(IMaterialRepository materialRepository) : IRequestHandler<DeleteMaterialCommand>
{
    public async Task Handle(DeleteMaterialCommand request, CancellationToken cancellationToken)
    {
        await materialRepository.DeleteAsync(request.Id);
    }
}
