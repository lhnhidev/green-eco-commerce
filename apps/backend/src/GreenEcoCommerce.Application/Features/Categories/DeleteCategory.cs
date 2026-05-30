using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Categories;

public record DeleteCategoryCommand(Guid Id) : IRequest<Unit>;

public class DeleteCategoryHandler(ICategoryRepository categoryRepository)
        : IRequestHandler<DeleteCategoryCommand, Unit>
{
    public async Task<Unit> Handle(DeleteCategoryCommand command, CancellationToken ct)
    {
        await categoryRepository.DeleteAsync(command.Id, ct);

        return Unit.Value;
    }
}
