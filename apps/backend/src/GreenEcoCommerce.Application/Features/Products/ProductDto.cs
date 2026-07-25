using FluentValidation;
using GreenEcoCommerce.Application.Features.Materials;
using GreenEcoCommerce.Application.Features.Reviews;
using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Products;

public record ProductPayloadDto(
    string Name,
    string? Description,
    decimal Price,
    int StockQty,
    Guid CategoryId,
    float CarbonIndex,
    float BaselineCarbonIndex,
    float DecomposePercent,
    float RecyclePercent,
    string[] ImageUrl,
    Guid[] MaterialIds
) : IRequest<ProductDto>
{
    public class Validator : AbstractValidator<ProductPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.Name)
                    .NotEmpty().WithMessage("Product name is required.")
                    .MaximumLength(255).WithMessage("Product name must not exceed 255 characters.");

            RuleFor(x => x.Price)
                    .GreaterThan(0).WithMessage("Price must be greater than 0.");

            RuleFor(x => x.StockQty)
                    .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");

            RuleFor(x => x.CategoryId)
                    .NotEmpty().WithMessage("Category ID is required.");

            RuleFor(x => x.CarbonIndex)
                    .GreaterThan(0).WithMessage("Carbon index must be greater than 0.")
                    .LessThan(10000).WithMessage("Carbon index must be less than 10000.");

            RuleFor(x => x.BaselineCarbonIndex)
                    .GreaterThan(0).WithMessage("Baseline carbon index must be greater than 0.");

            RuleFor(x => x.DecomposePercent)
                    .InclusiveBetween(0, 100).WithMessage("Decompose percent must be between 0 and 100.");

            RuleFor(x => x.RecyclePercent)
                    .InclusiveBetween(0, 100).WithMessage("Recycle percent must be between 0 and 100.");
        }
    }
}

public record ProductDto(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQty,
    Guid CategoryId,
    float CarbonIndex,
    float BaselineCarbonIndex,
    float DecomposePercent,
    float RecyclePercent,
    string[] ImageUrl,
    MaterialDto[] Materials,
    ReviewDto[] Reviews,
    bool IsActive
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public static partial class ProductDtoMapper
{
    [MapperRequiredMapping(RequiredMappingStrategy.None)]
    public static partial ProductDto ToDto(this Product product);
    public static partial IQueryable<ProductDto> ProjectToDto(this IQueryable<Product> products);

    [MapperRequiredMapping(RequiredMappingStrategy.Target)]
    [MapProperty(nameof(Review.User), nameof(ReviewDto.UserName), Use = nameof(MapUserToUserName))]
    public static partial ReviewDto ToDto(this Review review);

    [UserMapping(Default = false)]
    private static string MapUserToUserName(User user) => $"{user.FirstName} {user.LastName}";

    private static ReviewDto[] MapReviews(ICollection<Review> reviews)
        => reviews.Where(x => x.IsApproved && !x.IsHidden)
                .OrderByDescending(x => x.CreatedAt).Select(x => ToDto(x)).ToArray();

    [MapperIgnoreSource(nameof(ProductPayloadDto.MaterialIds))]
    public static partial Product ToEntity(this ProductPayloadDto payload);
    [MapperIgnoreSource(nameof(ProductPayloadDto.MaterialIds))]
    public static partial void ApplyUpdate([MappingTarget] this Product product, ProductPayloadDto payload);
}
