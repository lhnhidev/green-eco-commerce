using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Queries;

public static class CategoryQueries
{
    public static IQueryable<Category> WithId(this IQueryable<Category> categories, Guid id)
    {
        return categories.Where(c => c.Id == id);
    }

    public static IQueryable<Category> WithIds(this IQueryable<Category> categories, IEnumerable<Guid> ids)
    {
        return categories.Where(c => ids.Contains(c.Id));
    }
}
