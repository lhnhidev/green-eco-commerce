using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Queries;

public static class BannerQueries
{
    extension (IQueryable<Banner> query)
    {
        public IQueryable<Banner> IsActive()
        {
            return query.Where(b => b.IsActive);
        }
    }
}
