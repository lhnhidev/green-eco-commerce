using System.Linq.Expressions;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Common.Models;

public interface ISortParameters<TEntity>
{
    bool? SortDescending { get; init; }

    IQueryable<TEntity> ApplySorting(IQueryable<TEntity> query);
}

public interface ISearchParameters<TEntity>
{
    IQueryable<TEntity> ApplySearching(IQueryable<TEntity> query);
}

public interface IFilterParameters<TEntity>
{
    IQueryable<TEntity> ApplyFiltering(IQueryable<TEntity> query);
}

/// <summary>
/// Generic query parameters
/// </summary>
/// <remarks>
/// This class is meant for inheritance to add search and filtering
/// </remarks>
public abstract class QueryParameters<TEntity>
{
    // Pagination
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;

    public async Task<PagedResult<TDto>> ApplyAsync<TDto>(IQueryable<TEntity> query,
                                                          Func<IQueryable<TEntity>, IQueryable<TDto>> projection,
                                                          CancellationToken ct = default)
    {
        if (this is ISearchParameters<TEntity> searchParams) { query = searchParams.ApplySearching(query); }

        if (this is IFilterParameters<TEntity> filterParams) { query = filterParams.ApplyFiltering(query); }

        if (this is ISortParameters<TEntity> sortParams) { query = sortParams.ApplySorting(query); }

        return await query.ApplyPaginationAsync(
            PageNumber.GetValueOrDefault(1),
            PageSize.GetValueOrDefault(0),
            projection,
            ct);
    }
}

public static class QueryParametersExtensions
{
    extension<TEntity>(IQueryable<TEntity> query)
    {
        public IQueryable<TEntity> ApplySorting<TKey>(Expression<Func<TEntity, TKey>> sortExpression,
                                                      bool? sortDescending)
        {
            return sortDescending.GetValueOrDefault()
                    ? query.OrderByDescending(sortExpression)
                    : query.OrderBy(sortExpression);
        }

        public async Task<PagedResult<TDto>> ApplyPaginationAsync<TDto>(int pageNumber, int pageSize,
                                                                        Func<IQueryable<TEntity>, IQueryable<TDto>>
                                                                                projection,
                                                                        CancellationToken ct = default)
        {
            int totalCount = await query.CountAsync(ct);

            if (pageSize > 0) { query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize); }

            return new PagedResult<TDto>
            {
                Items = await projection(query).ToArrayAsync(ct),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}

public class QueryParametersValidator<TEntity> : AbstractValidator<QueryParameters<TEntity>>
{
    public QueryParametersValidator()
    {
        RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0.")
                .When(x => x.PageNumber.HasValue);

        // 0 means no limit, so we allow it to be 0 or greater
        RuleFor(x => x.PageSize)
                .GreaterThanOrEqualTo(0).WithMessage("Page size must be a not negative number.")
                .When(x => x.PageSize.HasValue);
    }
}
