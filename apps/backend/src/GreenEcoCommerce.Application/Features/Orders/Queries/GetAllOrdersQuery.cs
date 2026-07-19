using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Queries;

public enum OrderSortBy
{
    CreatedAt,
    TotalAmount
}

public record GetAllOrdersQuery(GetAllOrdersQuery.Parameters Query) : IRequest<PagedResult<OrderDto>>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetAllOrdersQuery, PagedResult<OrderDto>>
    {
        public async Task<PagedResult<OrderDto>> Handle(GetAllOrdersQuery request, CancellationToken ct)
        {
            var orderQuery = dbContext.Orders;
            return await request.Query.ApplyAsync(orderQuery, OrderDtoSummaryMapper.ProjectToSummaryDto, ct);
        }
    }

    public class Parameters : QueryParameters<Order>, ISortParameters<Order>, IFilterParameters<Order>
    {
        public OrderSortBy? SortBy { get; init; }
        public bool? SortDescending { get; init; }
        public Guid? UserId { get; init; }

        public IQueryable<Order> ApplySorting(IQueryable<Order> query)
        {
            return SortBy switch
            {
                OrderSortBy.CreatedAt => query.ApplySorting(o => o.CreatedAt, SortDescending),
                OrderSortBy.TotalAmount => query.ApplySorting(
                    o => o.OrderItems.Sum(oi => oi.UnitPrice * oi.Quantity) - o.DiscountAmount,
                    SortDescending),
                _ => query.ApplySorting(o => o.Id, SortDescending)
            };
        }

        public IQueryable<Order> ApplyFiltering(IQueryable<Order> query)
        {
            if (UserId.HasValue) { query = query.Where(o => o.UserId == UserId.Value); }

            return query;
        }
    }
}
