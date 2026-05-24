using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GreenEcoCommerce.Application.Interfaces.Persistence
{
    public interface IApplicationDbContext
    {
        public DbSet<User> Users { get; }
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
