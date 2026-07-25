using System.Data.Common;
using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Reviews.Commands;

public record CreateReviewCommand(Guid ProductId, Guid UserId, CreateReviewPayloadDto Payload) : IRequest<ReviewDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<CreateReviewCommand, ReviewDto>
    {
        /// <summary>PostgreSQL SQLSTATE for unique_violation.</summary>
        private const string PostgresUniqueViolation = "23505";

        public async Task<ReviewDto> Handle(CreateReviewCommand command, CancellationToken ct)
        {
            // Validate product exists
            if (!await dbContext.Products.AnyAsync(p => p.Id == command.ProductId, ct))
            {
                throw new NotFoundException($"Product with ID {command.ProductId} not found.");
            }

            // Only a customer who already received this product is allowed to review it
            bool hasPurchased = await dbContext.Orders.AnyAsync(
                o => o.UserId == command.UserId
                     && o.Status == OrderStatusEnum.Delivered
                     && o.OrderItems.Any(i => i.ProductId == command.ProductId),
                ct);

            if (!hasPurchased)
            {
                throw new ForbiddenException("You can only review a product you have purchased and received.");
            }

            // One review per product per user - fast path, the unique index below is the real guard
            if (await dbContext.Reviews.AnyAsync(
                    r => r.UserId == command.UserId && r.ProductId == command.ProductId, ct))
            {
                throw new ConflictException("You have already reviewed this product.");
            }

            var review = command.Payload.ToEntity();
            review.ProductId = command.ProductId;
            review.UserId = command.UserId;

            await dbContext.Reviews.AddAsync(review, ct);

            try
            {
                await dbContext.SaveChangesAsync(ct);
            }
            catch (DbUpdateException ex) when (IsUniqueViolation(ex))
            {
                // Two concurrent requests can both pass the pre-check above; the unique index on
                // (user_id, product_id) is what actually settles the race.
                throw new ConflictException("You have already reviewed this product.");
            }

            // The DTO exposes the reviewer's full name, so the User navigation has to be materialized
            await dbContext.Reviews.Entry(review).Reference(r => r.User).LoadAsync(ct);

            return review.ToDto();
        }

        /// <summary>
        /// Walks the exception chain looking for a provider error carrying the unique_violation
        /// SQLSTATE. The chain is walked because the configured exception processor re-wraps the
        /// original <see cref="DbUpdateException"/>.
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
            RuleFor(x => x.Payload).SetValidator(new CreateReviewPayloadDto.Validator());
        }
    }
}