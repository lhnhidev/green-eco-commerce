using FluentValidation;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Reviews.Queries;

public record GetProductReviewsQuery(Guid ProductId, GetProductReviewsQuery.Parameters Query)
        : IRequest<PagedResult<ReviewDto>>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<GetProductReviewsQuery, PagedResult<ReviewDto>>
    {
        public async Task<PagedResult<ReviewDto>> Handle(GetProductReviewsQuery req, CancellationToken ct)
        {
            return await req.Query.ApplyAsync(db.Reviews.OfProduct(req.ProductId), ReviewDtoMapper.ProjectToDto, ct);
        }
    }

    public class Parameters : QueryParameters<Review>, ISortParameters<Review>
    {
        public bool? SortDescending { get; init; } = true;

        // Newest first unless the caller asks otherwise. The `?? true` is not redundant with the
        // initializer above: [AsParameters] binding overwrites it with null when the client omits
        // the parameter, which would otherwise fall through to ascending order.
        public IQueryable<Review> ApplySorting(IQueryable<Review> query) =>
                query.ApplySorting(r => r.CreatedAt, SortDescending ?? true);
    }

    public class Validator : AbstractValidator<GetProductReviewsQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Query).SetValidator(new QueryParametersValidator<Review>());
        }
    }
}