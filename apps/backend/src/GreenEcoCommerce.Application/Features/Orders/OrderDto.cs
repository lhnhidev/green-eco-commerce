using AutoMapper;
using GreenEcoCommerce.Application.Features.Orders.Command;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.Features.Orders;

public record CreateOrderCommandResponse(Guid Id, Guid UserId, OrderStatusEnum Status, string DeliveryAddress, decimal DiscountAmount, decimal EarnedPoints, DateTimeOffset CreatedAt);

public class OrderProfie : Profile
{
    public OrderProfie()
    {
        CreateMap<CreateOrderCommand, Order>();
        CreateMap<Order, CreateOrderCommandResponse>();
    }
}
