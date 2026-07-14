using GreenEcoCommerce.Application.Features.OrderItems.Commands;
using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.OrderItems;

public record CreateOrderItemCommandResponse(
    Guid Id,
    Guid OrderId,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    float UnitCo2Saved
);

[Mapper]
public static partial class OrderItemsMapper
{
    public static partial OrderItem ToEntity(this CreateOrderItemCommand command);
    public static partial CreateOrderItemCommandResponse ToDto(this OrderItem orderItem);
}
