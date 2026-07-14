using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Carts;

public record CartItemDto(
    Guid ProductId,
    string ProductName,
    decimal ProductPrice,
    string ProductImageUrl,
    int Quantity,
    int CurrentStockQuantity
);

public record CartDto(Guid Id, Guid UserId, CartItemDto[] Items);

public record AddCartItemPayloadDto(Guid ProductId, int Quantity = 1);

public record UpdateCartItemPayloadDto(int Quantity);

[Mapper]
public static partial class CartDtoMapper
{
    [MapProperty([nameof(CartItem.Product), nameof(Product.StockQty)], nameof(CartItemDto.CurrentStockQuantity))]
    public static partial CartItemDto ToDto(this CartItem cartItem);

    [MapProperty(nameof(Cart.CartItems), nameof(CartDto.Items))]
    public static partial CartDto ToDto(this Cart cart);
}
