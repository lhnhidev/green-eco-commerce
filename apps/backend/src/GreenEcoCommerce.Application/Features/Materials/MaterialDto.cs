using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Materials;

public record MaterialPayloadDto(string Name, MaterialTypeEnum Type, int EcoRating) : IRequest<MaterialDto>
{
    public class Validator : AbstractValidator<MaterialPayloadDto>
    {
        public Validator()
        {
            RuleFor(p => p.Name)
                    .NotEmpty().WithMessage("Name is required")
                    .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

            RuleFor(p => p.Type)
                    .IsInEnum().WithMessage("Type must be in enum");

            RuleFor(p => p.EcoRating)
                    .NotNull().WithMessage("EcoRating is required")
                    .LessThanOrEqualTo(100).WithMessage("EcoRating must be less than or equal to 100")
                    .GreaterThanOrEqualTo(0).WithMessage("EcoRating must be greater than or equal to 0");
        }
    }
}

public record MaterialDto(Guid Id, string Name, MaterialTypeEnum Type, int EcoRating);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public static partial class MaterialDtoMapper
{
    [MapperRequiredMapping(RequiredMappingStrategy.Target)]
    public static partial MaterialDto ToDto(this Material material);
    public static partial IQueryable<MaterialDto> ProjectToDto(this IQueryable<Material> q);

    public static partial Material ToEntity(this MaterialPayloadDto dto);
    public static partial void ApplyUpdate([MappingTarget] this Material material, MaterialPayloadDto dto);
}
