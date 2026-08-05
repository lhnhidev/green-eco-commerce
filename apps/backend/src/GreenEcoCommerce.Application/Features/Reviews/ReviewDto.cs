using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Reviews;

public record ReviewPayloadDto(int Rating, string Comment)
{
    public class Validator : AbstractValidator<ReviewPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.Rating).InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");
            RuleFor(x => x.Comment).NotEmpty().MaximumLength(1000);
        }
    }
}

public record ReviewDto(
    Guid Id,
    Guid UserId,
    string UserName,
    Guid ProductId,
    int Rating,
    string Comment,
    bool IsApproved,
    bool IsHidden,
    DateTimeOffset CreatedAt
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class ReviewDtoMapper
{
    [MapProperty(nameof(Review.User), nameof(ReviewDto.UserName), Use = nameof(MapUserToUserName))]
    public static partial ReviewDto ToDto(this Review review);
    public static partial IQueryable<ReviewDto> ProjectToDto(this IQueryable<Review> reviews);

    [UserMapping(Default = false)]
    private static string MapUserToUserName(User user) => $"{user.FirstName} {user.LastName}";
}
