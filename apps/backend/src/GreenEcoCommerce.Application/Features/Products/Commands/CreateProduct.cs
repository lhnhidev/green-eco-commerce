using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Commands;

public class CreateProductHandler(IProductRepository productRepository, IMaterialRepository materialRepository, IMapper mapper)
    : IRequestHandler<ProductPayloadDto, ProductDto>
{
    public async Task<ProductDto> Handle(ProductPayloadDto command, CancellationToken ct)
    {
        var product = mapper.Map<Product>(command);
        var materials = await materialRepository.GetManyAsync(command.MaterialIds, ct);

        product.Materials = materials;
        var saved = await productRepository.AddAsync(product, ct);

        return mapper.Map<ProductDto>(saved);
    }
}
