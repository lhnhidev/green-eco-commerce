using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Products.Commands;

public record UpdateProductCommand(Guid Id, ProductPayloadDto Dto) : IRequest<ProductDto>
{
    public class Handler(IApplicationDbContext dbContext)
            : IRequestHandler<UpdateProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(UpdateProductCommand command, CancellationToken ct)
        {
            var product = await dbContext.Products.WithId(command.Id).IncludeMaterials().FirstOrDefaultAsync(ct) ??
                          throw new NotFoundException($"Product with ID {command.Id} not found.");

            product.ApplyUpdate(command.Dto);

            var materials = await dbContext.Materials.WithIds(command.Dto.MaterialIds).ToArrayAsync(ct);
            product.Materials.Clear();

            foreach (var material in materials)
            {
                product.Materials.Add(material);
            }

            await dbContext.SaveChangesAsync(ct);

            return await dbContext.Products.WithId(command.Id).ProjectToDto().FirstAsync(ct);
        }
    }

    public class Validator : AbstractValidator<UpdateProductCommand>
    {
        public Validator() { RuleFor(x => x.Dto).SetValidator(new ProductPayloadDto.Validator()); }
    }
}
