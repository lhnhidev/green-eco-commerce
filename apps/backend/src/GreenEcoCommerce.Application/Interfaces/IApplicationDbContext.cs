using System;
using System.Collections.Generic;
using System.Text;

namespace GreenEcoCommerce.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
