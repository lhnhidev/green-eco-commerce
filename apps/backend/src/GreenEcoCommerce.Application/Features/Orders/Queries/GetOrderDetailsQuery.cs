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
            var orderQuery = dbContext.Orders;

            var order = await orderQuery.ProjectToDto().FirstOrDefaultAsync(o => o.Id == request.OrderId, ct);

            return order ?? throw new NotFoundException("Order not found");
        }
    }
}
