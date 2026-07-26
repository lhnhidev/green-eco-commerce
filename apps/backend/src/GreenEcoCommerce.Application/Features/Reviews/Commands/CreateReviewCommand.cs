using System.Data.Common;
using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
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
        /// <summary>PostgreSQL SQLSTATE for unique_violation.</summary>
        private const string PostgresUniqueViolation = "23505";

        public async Task<ReviewDto> Handle(CreateReviewCommand cmd, CancellationToken ct)
        {
            if (!await db.Products.AnyAsync(p => p.Id == cmd.ProductId, ct))
            {
                throw new NotFoundException($"Product with ID {cmd.ProductId} not found.");
            }

            // Only a customer who already received this product is allowed to review it
            bool hasPurchased = await db.Orders.AnyAsync(
                o => o.UserId == cmd.UserId
                     && o.Status == OrderStatusEnum.Delivered
                     && o.OrderItems.Any(i => i.ProductId == cmd.ProductId),
                ct);

            if (!hasPurchased)
            {
                throw new ForbiddenException("You can only review a product you have purchased and received.");
            }

            // Upsert: a second review from the same user edits the first one rather than being rejected
            var existing = await FindOwnReviewAsync(cmd, ct);

            if (existing is not null) { return await ApplyPayloadAsync(existing, cmd, ct); }

            var review = new Review
            {
                UserId = cmd.UserId,
                ProductId = cmd.ProductId,
                Rating = cmd.Payload.Rating,
                Comment = cmd.Payload.Comment,
                // The purchase check above already proves the reviewer received the product,
                // so the review is trustworthy enough to publish without waiting for approval.
                IsApproved = true,
            };

            db.Reviews.Add(review);

            try
            {
                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException ex) when (IsUniqueViolation(ex))
            {
                // Two concurrent requests can both miss the lookup above; the unique index on
                // (user_id, product_id) is what actually settles the race. The loser falls back
                // to updating the row that won, so the caller still gets upsert semantics.
                db.Reviews.Entry(review).State = EntityState.Detached;

                var winner = await FindOwnReviewAsync(cmd, ct)
                             ?? throw new InvalidOperationException(
                                     "Unique violation on reviews but no conflicting row was found.");

                return await ApplyPayloadAsync(winner, cmd, ct);
            }

            // The DTO exposes the reviewer's name, so the User navigation has to be materialized
            await db.Reviews.Entry(review).Reference(r => r.User).LoadAsync(ct);

            return review.ToDto();
        }

        /// <summary>
        /// Loads the caller's own review for this product, approved or not, with the User
        /// navigation attached so the result can be mapped to <see cref="ReviewDto"/>.
        /// </summary>
        private Task<Review?> FindOwnReviewAsync(CreateReviewCommand cmd, CancellationToken ct) =>
                db.Reviews.IncludeUser()
                  .FirstOrDefaultAsync(r => r.UserId == cmd.UserId && r.ProductId == cmd.ProductId, ct);

        private async Task<ReviewDto> ApplyPayloadAsync(Review review, CreateReviewCommand cmd, CancellationToken ct)
        {
            review.Rating = cmd.Payload.Rating;
            review.Comment = cmd.Payload.Comment;
            review.IsApproved = true;

            // IsHidden is left alone: editing a review must not undo an admin's decision to hide it.
            await db.SaveChangesAsync(ct);

            return review.ToDto();
        }

        /// <summary>
        /// Walks the exception chain looking for a provider error carrying the unique_violation
        /// SQLSTATE, because the original <see cref="DbUpdateException"/> may be re-wrapped.
        /// </summary>
        private static bool IsUniqueViolation(Exception? exception)
        {
            for (var current = exception; current != null; current = current.InnerException)
            {
                if (current is DbException { SqlState: PostgresUniqueViolation }) { return true; }
            }

            return false;
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