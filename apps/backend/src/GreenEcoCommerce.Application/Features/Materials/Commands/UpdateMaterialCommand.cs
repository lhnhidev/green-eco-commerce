using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public partial record UpdateMaterialCommand(Guid Id, MaterialPayloadDto Dto) : IRequest<MaterialItem>
{
    public class Handler(IMaterialRepository materialRepository) : IRequestHandler<UpdateMaterialCommand, MaterialItem>
    {
        public async Task<MaterialItem> Handle(UpdateMaterialCommand command, CancellationToken ct)
        {
            var material = Mapper.ToEntity(command);
            bool found = await materialRepository.UpdateAsync(material, ct);
            return found ? material.ToDto() : throw new NotFoundException($"Material with ID {command.Id} not found.");
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        [MapNestedProperties(nameof(Dto))]
        public static partial Material ToEntity(UpdateMaterialCommand command);
    }

    public class Validator : AbstractValidator<UpdateMaterialCommand>
    {
        public Validator()
        {
            RuleFor(c => c.Id)
                    .NotEmpty().WithMessage("Material id is required")
                    .Must(id => id != Guid.Empty).WithMessage("Material id cannot be empty");

            RuleFor(c => c.Dto.Name)
                    .NotEmpty().WithMessage("Material name is required")
                    .MaximumLength(300).WithMessage("Material name cannot exceed 180 characters")
                    .MinimumLength(2).WithMessage("Material name cannot exceed 3 characters");

            // RuleFor(c => c.Dto.Type)
            //     .NotEmpty().WithMessage("Material type is required")
            //     .IsEnumName(typeof(MaterialTypeEnum)).WithMessage("Type must be in enum (Natural, Synthetic, Recycled)");

            RuleFor(c => c.Dto.EcoRating)
                    .NotNull().WithMessage("EcoRating is required")
                    .GreaterThanOrEqualTo(1).WithMessage("EcoRating must be greater than or equal to 1")
                    .LessThanOrEqualTo(100).WithMessage("EcoRating must be less than or equal to 100");
        }
    }
}
