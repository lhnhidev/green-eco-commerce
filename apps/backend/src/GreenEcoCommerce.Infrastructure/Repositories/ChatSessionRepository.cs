using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class ChatSessionRepository(IApplicationDbContext context) : IChatSessionRepository
{
    public async Task<ChatSession?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct)
    {
        return await context.ChatSessions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId, ct);
    }

    public async Task<List<ChatSession>> GetAllByUserIdAsync(Guid userId, CancellationToken ct)
    {
        return await context.ChatSessions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<ChatSession> AddAsync(ChatSession session, CancellationToken ct)
    {
        await context.ChatSessions.AddAsync(session, ct);
        await context.SaveChangesAsync(ct);

        return session;
    }

    public async Task<bool> UpdateAsync(ChatSession session, CancellationToken ct)
    {
        int affectedRows = await context.ChatSessions
            .Where(s => s.Id == session.Id && s.UserId == session.UserId)
            .ExecuteUpdateAsync(set => set
                .SetProperty(s => s.Title, session.Title),
                ct);

        return affectedRows > 0;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken ct)
    {
        int affectedRows = await context.ChatSessions
            .Where(s => s.Id == id && s.UserId == userId)
            .ExecuteDeleteAsync(ct);

        return affectedRows > 0;
    }
}
