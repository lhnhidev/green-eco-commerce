using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Reviews.Commands;

public record ApproveReviewCommand(Guid ReviewId) : IRequest<ReviewDto?>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<ApproveReviewCommand, ReviewDto?>
    {
        public async Task<ReviewDto?> Handle(ApproveReviewCommand cmd, CancellationToken ct)
        {
            var review = await db.Reviews.IncludeUser().FirstOrDefaultAsync(r => r.Id == cmd.ReviewId, ct);
            if (review is null) return null;

            review.IsApproved = true;
            review.IsHidden = false;

            await db.SaveChangesAsync(ct);
            return review.ToDto();
        }
    }
}

public record HideReviewCommand(Guid ReviewId) : IRequest<ReviewDto?>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<HideReviewCommand, ReviewDto?>
    {
        public async Task<ReviewDto?> Handle(HideReviewCommand cmd, CancellationToken ct)
        {
            var review = await db.Reviews.IncludeUser().FirstOrDefaultAsync(r => r.Id == cmd.ReviewId, ct);
            if (review is null) return null;

            review.IsHidden = true;
            review.IsApproved = false;

            await db.SaveChangesAsync(ct);
            return review.ToDto();
        }
    }
}

public record DeleteReviewCommand(Guid ReviewId) : IRequest
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<DeleteReviewCommand>
    {
        public async Task Handle(DeleteReviewCommand cmd, CancellationToken ct)
        {
            await db.Reviews.Where(r => r.Id == cmd.ReviewId).ExecuteDeleteAsync(ct);
        }
    }
}
