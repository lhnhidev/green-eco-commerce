using FluentValidation;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public record DeleteMaterialCommand(Guid Id) : IRequest
{
    public class Handler(IMaterialRepository materialRepository) : IRequestHandler<DeleteMaterialCommand>
    {
        public async Task Handle(DeleteMaterialCommand request, CancellationToken ct)
        {
            await materialRepository.DeleteAsync(request.Id, ct);
        }
    }

    public class Validator : AbstractValidator<DeleteMaterialCommand>
    {
        public Validator()
        {
            RuleFor(command => command.Id)
                    .NotEmpty().WithMessage("Material id is required")
                    .Must(id => id != Guid.Empty).WithMessage("Material id cannot be empty");
        }
    }
}
