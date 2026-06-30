using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.CheckoutProducts.Command;

public record CreateCheckoutProductsCommand(List<ProductInfo> ProductList) : IRequest<CreateCheckoutProductsCommandResponse>;

public class CreateCheckoutProductsCommandHandler(IProductRepository productRepository) : IRequestHandler<CreateCheckoutProductsCommand, CreateCheckoutProductsCommandResponse>
{
    public async Task<CreateCheckoutProductsCommandResponse> Handle(CreateCheckoutProductsCommand command, CancellationToken cancellationToken)
    {
        if (!command.ProductList.Any())
        {
            return new CreateCheckoutProductsCommandResponse(0, 0, 0, new List<CheckoutItemDto>());
        }

        var productIds = command.ProductList.Select(p => p.ProductId).ToList();

        var products = await productRepository.GetByIdsAsync(productIds, cancellationToken);

        var productDict = products.ToDictionary(p => p.Id);

        var checkoutItems = new List<CheckoutItemDto>();
        decimal totalPrice = 0;
        int totalItemsCount = 0;

        foreach (var item in command.ProductList)
        {
            if (productDict.TryGetValue(item.ProductId, out var product))
            {
                if (product.StockQty < item.AmountProduct)
                {
                    throw new BadRequestException($"Product {product.Name} is out of stock or insufficient.");
                }

                decimal subTotal = product.Price * item.AmountProduct;

                totalPrice += subTotal;
                totalItemsCount += item.AmountProduct;

                checkoutItems.Add(new CheckoutItemDto(
                    product.Id,
                    product.Name,
                    product.Price,
                    item.AmountProduct, // Số lượng tương ứng
                    subTotal
                ));
            }
        }

        return new CreateCheckoutProductsCommandResponse(
            TotalUniqueProducts: checkoutItems.Count, // Tổng số loại product
            TotalItemsCount: totalItemsCount,         // Tổng số lượng sản phẩm
            TotalPrice: totalPrice,                   // Tổng số tiền
            Items: checkoutItems
        );
    }
}
