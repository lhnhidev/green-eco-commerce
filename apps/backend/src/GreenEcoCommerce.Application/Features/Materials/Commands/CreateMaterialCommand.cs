using FluentValidation;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public class CreateMaterialCommandHandler(IMaterialRepository materialRepository) : IRequestHandler<MaterialPayloadDto, MaterialItem>
{
    public async Task<MaterialItem> Handle(MaterialPayloadDto command, CancellationToken ct)
    {
        var material = command.ToEntity();
        await materialRepository.AddAsync(material, ct);

        return material.ToDto();
    }

    public class Validator : AbstractValidator<MaterialPayloadDto>
    {
        public Validator()
        {
            RuleFor(p => p.Name)
                    .NotEmpty().WithMessage("Name is required")
                    .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

            RuleFor(p => p.EcoRating)
                    .NotEmpty().WithMessage("EcoRating is required")
                    .LessThanOrEqualTo(100).WithMessage("EcoRating must be greater than or equal to 100")
                    .GreaterThanOrEqualTo(0).WithMessage("EcoRating must be less than or equal to 0");

            // RuleFor(p => p.Type)
            //         .NotEmpty().WithMessage("Type is required")
            //         .IsEnumName(typeof(MaterialTypeEnum)).WithMessage("Type must be in enum");
        }
    }
}
