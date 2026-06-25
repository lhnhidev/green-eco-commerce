using AutoMapper;
using GreenEcoCommerce.Application.Features.OrderItems.Command;
using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Features.OrderItems;

public record CreateOrderItemCommandResponse(
    Guid Id,
    Guid OrderId,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    float UnitCo2Saved
);

public class OrderItemsProfile : Profile
{
    public OrderItemsProfile()
    {
        CreateMap<CreateOrderItemCommand, OrderItem>();
        CreateMap<OrderItem, CreateOrderItemCommandResponse>();
    }
}
