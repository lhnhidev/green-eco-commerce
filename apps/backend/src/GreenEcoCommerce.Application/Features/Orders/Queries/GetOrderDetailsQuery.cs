using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Orders.Queries;

public record GetOrderDetailsQuery(Guid OrderId) : IRequest<OrderDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetOrderDetailsQuery, OrderDto>
    {
        public async Task<OrderDto> Handle(GetOrderDetailsQuery request, CancellationToken ct)
        {
            var order = await dbContext.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == request.OrderId, ct)
                ?? throw new KeyNotFoundException($"Order {request.OrderId} not found.");

            return order.ToDto();
        }
    }
}
