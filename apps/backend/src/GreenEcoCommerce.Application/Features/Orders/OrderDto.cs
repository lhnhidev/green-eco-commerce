using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Orders;

public record OrderItemDto(
    Guid ProductId,
    string ProductName,
    string? ProductImage,
    int Quantity,
    decimal UnitPrice,
    decimal UnitCo2Saved
);

public record OrderDto(
    Guid Id,
    Guid UserId,
    OrderStatusEnum Status,
    string DeliveryAddress,
    decimal TotalAmount,
    decimal FinalAmount,
    decimal DiscountAmount,
    decimal TotalCo2Saved,
    decimal EarnedPoints,
    OrderItemDto[] Items,
    DateTimeOffset CreatedAt
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class OrderDtoMapper
{
    [MapProperty(nameof(OrderItem.Product), nameof(OrderItemDto.ProductImage), Use = nameof(MapProductImage))]
    private static partial OrderItemDto ToDto(this OrderItem orderItem);

    [MapProperty(nameof(Order.OrderItems), nameof(OrderDto.TotalAmount), Use = nameof(MapItemsToTotalAmount))]
    [MapProperty(nameof(Order.Payment), nameof(OrderDto.FinalAmount), Use = nameof(MapPaymentToFinalAmount))]
    [MapProperty(nameof(Order.OrderItems), nameof(OrderDto.TotalCo2Saved), Use = nameof(MapItemsToTotalCo2Saved))]
    [MapProperty(nameof(Order.OrderItems), nameof(OrderDto.Items))]
    public static partial OrderDto ToDto(this Order order);

    public static partial IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> orders);

    [UserMapping(Default = false)]
    public static decimal MapItemsToTotalAmount(ICollection<OrderItem> items) =>
            items.Sum(item => item.UnitPrice * item.Quantity);

    [UserMapping(Default = false)]
    public static decimal MapItemsToTotalCo2Saved(ICollection<OrderItem> items) =>
            items.Sum(item => item.UnitCo2Saved * item.Quantity);

    [UserMapping(Default = false)]
    public static decimal MapPaymentToFinalAmount(Payment? payment) => payment?.Amount ?? 0;

    [UserMapping(Default = false)]
    private static string? MapProductImage(Product product) => product.ImageUrl.FirstOrDefault();
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class OrderDtoSummaryMapper
{
    [MapProperty(nameof(Order.OrderItems), nameof(OrderDto.TotalAmount), Use = nameof(@OrderDtoMapper.MapItemsToTotalAmount))]
    [MapProperty(nameof(Order.Payment), nameof(OrderDto.FinalAmount), Use = nameof(@OrderDtoMapper.MapPaymentToFinalAmount))]
    [MapProperty(nameof(Order.OrderItems), nameof(OrderDto.TotalCo2Saved), Use = nameof(@OrderDtoMapper.MapItemsToTotalCo2Saved))]
    [MapValue(nameof(OrderDto.Items), Use = nameof(DefaultEmptyOrderItems))]
    public static partial OrderDto ToSummaryDto(this Order order);

    public static partial IQueryable<OrderDto> ProjectToSummaryDto(this IQueryable<Order> orders);

    private static OrderItemDto[] DefaultEmptyOrderItems() => [];
}
