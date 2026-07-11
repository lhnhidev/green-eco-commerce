using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Domain.Models;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record GetSomeProductsQuery(
    int PageSize = 10,
    int PageNumber = 1,
    string? SearchTerm = null,
    Guid? CategoryId = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? SortBy = null,
    bool IsDescending = false,
    bool? IsOrganic = null,
    bool? IsBiodegradable = null,
    bool? IsRecycled = null
) : IRequest<PagedResultDto<ProductDto>>;

public class GetSomeProductQueryHanlder(IProductRepository productRepository, IMapper mapper) : IRequestHandler<GetSomeProductsQuery, PagedResultDto<ProductDto>>
{
    public async Task<PagedResultDto<ProductDto>> Handle(GetSomeProductsQuery request, CancellationToken cancellationToken)
    {
        var filterParams = new ProductFilterParams
        {
            PageSize = request.PageSize,
            PageNumber = request.PageNumber,
            SearchTerm = request.SearchTerm,
            CategoryId = request.CategoryId,
            MinPrice = request.MinPrice,
            MaxPrice = request.MaxPrice,
            SortBy = request.SortBy,
            IsDescending = request.IsDescending,
            IsOrganic = request.IsOrganic,
            IsBiodegradable = request.IsBiodegradable,
            IsRecycled = request.IsRecycled
        };

        var result = await productRepository.GetSomeAsync(filterParams, cancellationToken);

        return new PagedResultDto<ProductDto>
        {
            Items = mapper.Map<List<ProductDto>>(result.Products),
            TotalCount = result.TotalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
