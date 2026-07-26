using FluentValidation;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public enum ProductSortBy
{
    Name,
    Price,
    CarbonIndex
}

public record GetAllProductsQuery(GetAllProductsQuery.Parameters Query)
        : IRequest<PagedResult<ProductDto>>
{
    public class Handler(IApplicationDbContext dbContext)
            : IRequestHandler<GetAllProductsQuery, PagedResult<ProductDto>>
    {
        public async Task<PagedResult<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken ct)
        {
            var productQuery = dbContext.Products.Where(p => p.IsActive);
            return await request.Query.ApplyAsync(productQuery, ProductDtoMapper.ProjectToDto, ct);
        }
    }

    public class Parameters : QueryParameters<Product>, ISortParameters<Product>, ISearchParameters<Product>, IFilterParameters<Product>
    {
        public ProductSortBy? SortBy { get; init; } = ProductSortBy.Name;
        public bool? SortDescending { get; init; }

        public string? Search { get; init; } = string.Empty;

        public Guid[]? CategoryIds { get; init; } = [];
        public bool? IsOrganic { get; init; }
        public bool? IsBiodegradable { get; init; }
        public bool? IsRecycled { get; init; }
        public decimal? MinPrice { get; init; }
        public decimal? MaxPrice { get; init; }

        public IQueryable<Product> ApplySearching(IQueryable<Product> query)
        {
            return string.IsNullOrWhiteSpace(Search) ? query : query.Where(p => p.Name.ToLower().Contains(Search.ToLower()));
        }

        public IQueryable<Product> ApplyFiltering(IQueryable<Product> query)
        {
            if (CategoryIds is { Length: > 0 })
            {
                query = query.Where(p =>
                        ((IEnumerable<Guid>)CategoryIds).Contains(p.CategoryId) || (p.Category.ParentId.HasValue &&
                            ((IEnumerable<Guid>)CategoryIds).Contains(p.Category.ParentId.Value)));
            }

            if (MinPrice.HasValue) { query = query.Where(p => p.Price >= MinPrice.Value); }

            if (MaxPrice.HasValue) { query = query.Where(p => p.Price <= MaxPrice.Value); }

            if (IsOrganic.GetValueOrDefault())
            {
                query = query.Where(p => p.Materials.Any(m => m.Type == MaterialTypeEnum.Organic));
            }

            if (IsBiodegradable.GetValueOrDefault())
            {
                query = query.Where(p =>
                        p.Materials.Any(m => m.Type == MaterialTypeEnum.Biodegradable) || p.DecomposePercent > 0);
            }

            if (IsRecycled.GetValueOrDefault())
            {
                query = query.Where(p =>
                        p.Materials.Any(m => m.Type == MaterialTypeEnum.Recycled) || p.RecyclePercent > 0);
            }

            return query;
        }

        public IQueryable<Product> ApplySorting(IQueryable<Product> query)
        {
            return SortBy switch
            {
                ProductSortBy.Price => query.ApplySorting(p => p.Price, SortDescending),
                ProductSortBy.CarbonIndex => query.ApplySorting(p => p.CarbonIndex, SortDescending),
                ProductSortBy.Name => query.ApplySorting(p => p.Name, SortDescending),
                _ => query.ApplySorting(p => p.Id, SortDescending) // default
            };
        }
    }

    public class Validator : AbstractValidator<GetAllProductsQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Query).SetValidator(new QueryParametersValidator<Product>());

            RuleFor(x => x.Query.MinPrice)
                .LessThanOrEqualTo(x => x.Query.MaxPrice)
                .When(x => x.Query.MaxPrice.HasValue)
                .WithMessage("MinPrice must be less than or equal to MaxPrice.")
                .GreaterThanOrEqualTo(0).WithMessage("MinPrice must be greater than or equal to 0.");

            RuleFor(x => x.Query.MaxPrice)
                .GreaterThanOrEqualTo(x => x.Query.MinPrice)
                .When(x => x.Query.MinPrice.HasValue)
                .WithMessage("MaxPrice must be greater than or equal to MinPrice.")
                .GreaterThan(0).WithMessage("MaxPrice must be greater than 0.");
        }
    }
}
