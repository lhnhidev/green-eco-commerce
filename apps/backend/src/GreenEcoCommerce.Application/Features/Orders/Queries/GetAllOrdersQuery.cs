using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Queries;

public enum OrderSortBy
{
    CreatedAt,
    TotalAmount
}

public record GetAllOrdersQuery(Guid? UserId, GetAllOrdersQuery.Parameters Query) : IRequest<PagedResult<OrderDto>>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetAllOrdersQuery, PagedResult<OrderDto>>
    {
        public async Task<PagedResult<OrderDto>> Handle(GetAllOrdersQuery request, CancellationToken ct)
        {
            IQueryable<Order> orderQuery = dbContext.Orders;

            if (request.UserId.HasValue)
            {
                orderQuery = orderQuery.Where(o => o.UserId == request.UserId);
            }

            if (request.Query.Status.HasValue)
            {
                orderQuery = orderQuery.Where(o => o.Status == request.Query.Status);
            }

            if (request.Query.Month.HasValue && request.Query.Year.HasValue)
            {
                // UTC-zero-offset construction: Order.CreatedAt is timestamptz, and Npgsql
                // rejects DateTimeOffset parameters with a non-zero offset for that column type.
                var periodStart = new DateTimeOffset(
                    request.Query.Year.Value, request.Query.Month.Value, 1, 0, 0, 0, TimeSpan.Zero);
                var periodEnd = periodStart.AddMonths(1);
                orderQuery = orderQuery.Where(o => o.CreatedAt >= periodStart && o.CreatedAt < periodEnd);
            }

            return await request.Query.ApplyAsync(orderQuery, OrderDtoSummaryMapper.ProjectToSummaryDto, ct);
        }
    }

    public class Parameters : QueryParameters<Order>, ISortParameters<Order>, ISearchParameters<Order>
    {
        public OrderSortBy? SortBy { get; init; }
        public bool? SortDescending { get; init; }
        public string? Search { get; init; }
        public OrderStatusEnum? Status { get; init; }
        public int? Month { get; init; }
        public int? Year { get; init; }

        public IQueryable<Order> ApplySearching(IQueryable<Order> query)
        {
            if (string.IsNullOrWhiteSpace(Search)) { return query; }

            string term = Search.ToLower();
            return query.Where(o => o.Id.ToString().ToLower().Contains(term) || o.DeliveryAddress.ToLower().Contains(term));
        }

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
    }
}
