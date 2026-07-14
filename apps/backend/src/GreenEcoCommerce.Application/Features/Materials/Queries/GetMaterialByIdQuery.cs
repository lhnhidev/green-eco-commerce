using FluentValidation;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Queries;

public record GetMaterialByIdQuery(Guid Id) : IRequest<MaterialItem>
{
    public class Handler(IMaterialRepository materialRepository) : IRequestHandler<GetMaterialByIdQuery, MaterialItem>
    {
        public async Task<MaterialItem> Handle(GetMaterialByIdQuery request, CancellationToken ct)
        {
            var materialItem = await materialRepository.GetByIdAsync(request.Id, ct);

            return materialItem != null ? materialItem.ToDto() : throw new NotFoundException("Material not found");
        }
    }

    public class Validator : AbstractValidator<GetMaterialByIdQuery>
    {
        public Validator()
        {
            RuleFor(p => p.Id)
                    .NotEmpty().WithMessage("Material ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Material ID cannot be empty.");
        }
    }
}
