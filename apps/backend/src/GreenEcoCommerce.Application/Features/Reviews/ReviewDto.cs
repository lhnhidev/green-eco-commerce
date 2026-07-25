using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Reviews;

public record CreateReviewPayloadDto(int Rating, string? Comment = null)
{
    public class Validator : AbstractValidator<CreateReviewPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.Rating)
                    .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");

            RuleFor(x => x.Comment)
                    .MaximumLength(500).WithMessage("Comment must not exceed 500 characters.")
                    .When(x => x.Comment != null);
        }
    }
}

public record ReviewDto(
    Guid Id,
    Guid ProductId,
    Guid UserId,
    string UserFullName,
    int Rating,
    string? Comment,
    DateTimeOffset CreatedAt
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public static partial class ReviewDtoMapper
{
    [MapperRequiredMapping(RequiredMappingStrategy.Target)]
    [MapProperty(nameof(Review), nameof(ReviewDto.UserFullName), Use = nameof(MapReviewToUserFullName))]
    public static partial ReviewDto ToDto(this Review review);

    public static partial IQueryable<ReviewDto> ProjectToDto(this IQueryable<Review> reviews);

    private static string MapReviewToUserFullName(Review review) => review.User.FirstName + " " + review.User.LastName;

    public static partial Review ToEntity(this CreateReviewPayloadDto payload);
}