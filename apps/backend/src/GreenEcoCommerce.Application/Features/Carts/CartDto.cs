using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Carts;

public record CartItemDto(
    Guid ProductId,
    string ProductName,
    decimal ProductPrice,
    string ProductImageUrl,
    decimal UnitCo2Saved,
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

public record CartDto(Guid Id, Guid UserId, CartItemDto[] Items, int PointsGained);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class CartDtoMapper
{
    [MapProperty([nameof(CartItem.Product), nameof(Product.StockQty)], nameof(CartItemDto.CurrentStockQuantity))]
    [MapProperty(nameof(CartItem.Product), nameof(CartItemDto.UnitCo2Saved), Use = nameof(MapProductToUnitCo2Saved))]
    public static partial CartItemDto ToDto(this CartItem cartItem);

    [MapProperty(nameof(Cart.CartItems), nameof(CartDto.Items))]
    [MapValue(nameof(CartDto.PointsGained), 0)]
    public static partial CartDto ToDto(this Cart cart);

    private static string MapImageUrlsToSingleImage(string[] imageUrls) => imageUrls.Length > 0 ? imageUrls[0] : string.Empty;

    private static decimal MapProductToUnitCo2Saved(Product product) => product.BaselineCarbonIndex > product.CarbonIndex ? product.BaselineCarbonIndex - product.CarbonIndex : 0;

    public static partial IQueryable<CartDto> ProjectToDto(this IQueryable<Cart> q);

    public static async Task<CartDto> ConfigurePointsSavedAsync(this CartDto cart, IApplicationConfiguration configuration)
    {
        decimal ratio = await configuration.GetGreenPointsPerCarbonIndexRatioAsync();
        int pointsGained = (int)Math.Floor(cart.Items.Sum(item => item.UnitCo2Saved * item.Quantity) * ratio);
        return cart with { PointsGained = pointsGained };
    }
}
