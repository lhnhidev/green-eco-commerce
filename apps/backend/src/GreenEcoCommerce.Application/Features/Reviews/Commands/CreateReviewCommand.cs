using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Reviews.Commands;

public record CreateReviewCommand(
    Guid ProductId,
    Guid UserId,
    ReviewPayloadDto Payload
) : IRequest<ReviewDto>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<CreateReviewCommand, ReviewDto>
    {
        public async Task<ReviewDto> Handle(CreateReviewCommand cmd, CancellationToken ct)
        {
            // Prevent duplicate reviews per user per product
            var existing = await db.Reviews
                .FirstOrDefaultAsync(r => r.UserId == cmd.UserId && r.ProductId == cmd.ProductId, ct);

            if (existing is not null)
            {
                existing.Rating = cmd.Payload.Rating;
                existing.Comment = cmd.Payload.Comment;
                existing.IsApproved = false;
                await db.SaveChangesAsync(ct);
                return existing.ToDto();
            }

            var review = new Review
            {
                UserId = cmd.UserId,
                ProductId = cmd.ProductId,
                Rating = cmd.Payload.Rating,
                Comment = cmd.Payload.Comment,
                IsApproved = false,
            };

            db.Reviews.Add(review);
            await db.SaveChangesAsync(ct);
            return review.ToDto();
        }
    }

    public class Validator : AbstractValidator<CreateReviewCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Payload).SetValidator(new ReviewPayloadDto.Validator());
        }
    }
}
