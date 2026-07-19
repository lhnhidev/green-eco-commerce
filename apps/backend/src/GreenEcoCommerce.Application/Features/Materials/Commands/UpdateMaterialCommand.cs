using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public record UpdateMaterialCommand(Guid Id, MaterialPayloadDto Dto) : IRequest<MaterialDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdateMaterialCommand, MaterialDto>
    {
        public async Task<MaterialDto> Handle(UpdateMaterialCommand command, CancellationToken ct)
        {
            var material = await dbContext.Materials.FindAsync([command.Id], ct) ??
                           throw new NotFoundException($"Material with ID {command.Id} not found.");

            material.ApplyUpdate(command.Dto);
            await dbContext.SaveChangesAsync(ct);

            return material.ToDto();
        }
    }

    public class Validator : AbstractValidator<UpdateMaterialCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Dto).SetValidator(new MaterialPayloadDto.Validator());
        }
    }
}
