using FluentValidation;
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

public record CartItemPayloadDto(Guid ProductId, int Quantity = 1)
{
    public class Validator : AbstractValidator<CartItemPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0.")
                .LessThanOrEqualTo(100).WithMessage("Quantity must not exceed 100 per item.");
        }
    }
}

public record CartDto(Guid Id, Guid UserId, CartItemDto[] Items);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class CartDtoMapper
{
    [MapProperty([nameof(CartItem.Product), nameof(Product.StockQty)], nameof(CartItemDto.CurrentStockQuantity))]
    public static partial CartItemDto ToDto(this CartItem cartItem);

    [MapProperty(nameof(Cart.CartItems), nameof(CartDto.Items))]
    public static partial CartDto ToDto(this Cart cart);

    public static partial IQueryable<CartDto> ProjectToDto(this IQueryable<Cart> q);
}
