using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Queries;

public static class MaterialQueries
{
    extension(IQueryable<Material> query)
    {
        public IQueryable<Material> WithId(Guid id)
        {
            return query.Where(m => m.Id == id);
        }

        public IQueryable<Material> WithIds(IEnumerable<Guid> ids)
        {
            return query.Where(m => ids.Contains(m.Id));
        }
    }
}
