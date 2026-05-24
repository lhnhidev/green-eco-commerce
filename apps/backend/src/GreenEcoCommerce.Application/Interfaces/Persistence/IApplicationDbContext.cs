using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Interfaces.Persistence;

public interface IApplicationDbContext
{
    public DbSet<User> Users { get; }
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
