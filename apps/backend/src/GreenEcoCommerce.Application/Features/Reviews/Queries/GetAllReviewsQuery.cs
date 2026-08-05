using FluentValidation;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Reviews.Queries;

public record GetAllReviewsQuery(GetAllReviewsQuery.Parameters Query) : IRequest<PagedResult<ReviewDto>>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<GetAllReviewsQuery, PagedResult<ReviewDto>>
    {
        public async Task<PagedResult<ReviewDto>> Handle(GetAllReviewsQuery req, CancellationToken ct)
        {
            return await req.Query.ApplyAsync(db.Reviews, ReviewDtoMapper.ProjectToDto, ct);
        }
    }

    public class Parameters : QueryParameters<Review>, ISortParameters<Review>, IFilterParameters<Review>
    {
        public bool? SortDescending { get; init; } = true;
        public bool? IsApproved { get; init; }
        public bool? IsHidden { get; init; }

        public IQueryable<Review> ApplyFiltering(IQueryable<Review> query)
        {
            if (IsApproved.HasValue) { query = query.Where(r => r.IsApproved == IsApproved); }

            if (IsHidden.HasValue) { query = query.Where(r => r.IsHidden == IsHidden); }

            return query;
        }

        // Newest first unless the caller asks otherwise. The `?? true` is not redundant with the
        // initializer above: [AsParameters] binding overwrites it with null when the client omits
        // the parameter, which would otherwise fall through to ascending order.
        public IQueryable<Review> ApplySorting(IQueryable<Review> query) =>
                query.ApplySorting(r => r.CreatedAt, SortDescending ?? true);
    }

    public class Validator : AbstractValidator<GetAllReviewsQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Query).SetValidator(new QueryParametersValidator<Review>());
        }
    }
}
