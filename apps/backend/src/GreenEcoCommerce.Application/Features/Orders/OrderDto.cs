using GreenEcoCommerce.Application.Features.Orders.Command;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Orders;

public record OrderDto(Guid Id, Guid UserId, OrderStatusEnum Status, string DeliveryAddress, decimal DiscountAmount, decimal EarnedPoints, DateTimeOffset CreatedAt);

[Mapper]
public static partial class OrderDtoMapper
{
    public static partial OrderDto ToDto(this Order order);
    public static partial Order ToEntity(this CreateOrderCommand command);
}
