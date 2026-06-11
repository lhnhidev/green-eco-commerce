using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Commands;

public record UpdateProductCommand(Guid Id, ProductPayloadDto Dto) : IRequest<ProductDto>;

public class UpdateProductProfile : Profile
{
    public UpdateProductProfile()
    {
        CreateMap<UpdateProductCommand, Product>().IncludeMembers(src => src.Dto);
    }
}

public class UpdateProductHandler(IProductRepository productRepository, IMapper mapper)
    : IRequestHandler<UpdateProductCommand, ProductDto>
{
    public async Task<ProductDto> Handle(UpdateProductCommand command, CancellationToken ct)
    {
        var product = mapper.Map<Product>(command);
        bool found = await productRepository.UpdateAsync(product, ct);
        return found
            ? mapper.Map<ProductDto>(product)
            : throw new NotFoundException($"Product with ID {command.Id} not found.");
    }
}
