using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Products.Commands;

public class CreateProductHandler(IApplicationDbContext dbContext)
        : IRequestHandler<ProductPayloadDto, ProductDto>
{
    public async Task<ProductDto> Handle(ProductPayloadDto command, CancellationToken ct)
    {
        var product = command.ToEntity();
        var materials = await dbContext.Materials.WithIds(command.MaterialIds).ToArrayAsync(ct);

        foreach (var material in materials)
        {
            product.Materials.Add(material);
        }

        await dbContext.Products.AddAsync(product, ct);
        await dbContext.SaveChangesAsync(ct);

        return product.ToDto();
    }
}
