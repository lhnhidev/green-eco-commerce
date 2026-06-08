using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products;

public record DeleteProductCommand(Guid Id) : IRequest<Unit>;

public class DeleteProductHandler(IProductRepository productRepository)
    : IRequestHandler<DeleteProductCommand, Unit>
{
    public async Task<Unit> Handle(DeleteProductCommand command, CancellationToken ct)
    {
        await productRepository.DeleteAsync(command.Id, ct);
        return Unit.Value;
    }
}
