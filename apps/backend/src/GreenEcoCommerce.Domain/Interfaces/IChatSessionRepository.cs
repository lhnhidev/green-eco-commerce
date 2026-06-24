using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IChatSessionRepository
{
    Task<ChatSession?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<List<ChatSession>> GetAllByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<ChatSession> AddAsync(ChatSession session, CancellationToken ct = default);
    Task<bool> UpdateAsync(ChatSession session, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken ct = default);
}
