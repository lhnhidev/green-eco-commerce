using FluentValidation;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Reviews.Queries;

public record GetProductReviewsQuery(Guid ProductId, GetProductReviewsQuery.Parameters Query)
        : IRequest<PagedResult<ReviewDto>>
{
    public class Handler(IApplicationDbContext dbContext)
            : IRequestHandler<GetProductReviewsQuery, PagedResult<ReviewDto>>
    {
        public async Task<PagedResult<ReviewDto>> Handle(GetProductReviewsQuery request, CancellationToken ct)
        {
            var reviewQuery = dbContext.Reviews.Where(r => r.ProductId == request.ProductId && r.IsApproved);
            return await request.Query.ApplyAsync(reviewQuery, ReviewDtoMapper.ProjectToDto, ct);
        }
    }

    public class Parameters : QueryParameters<Review>, ISortParameters<Review>
    {
        public bool? SortDescending { get; init; } = true;

        public IQueryable<Review> ApplySorting(IQueryable<Review> query)
        {
            // Reviews are always newest first. The init-default above cannot be relied on:
            // [AsParameters] binding overwrites it with null whenever the client omits the
            // parameter, which would otherwise fall through to ascending order.
            return query.OrderByDescending(r => r.CreatedAt);
        }
    }

    public class Validator : AbstractValidator<GetProductReviewsQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Query).SetValidator(new QueryParametersValidator<Review>());
        }
    }
}