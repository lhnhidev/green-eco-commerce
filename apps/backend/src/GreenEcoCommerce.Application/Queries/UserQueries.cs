using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Queries;

public static class UserQueries
{
    extension(IQueryable<User> query)
    {
        public IQueryable<User> WithId(Guid id)
        {
            return query.Where(u => u.Id == id);
        }

        public IQueryable<User> WithEmail(string email)
        {
            string normalized = email.Trim().ToLowerInvariant();
            return query.Where(u => (string)u.Email == normalized);
        }

        public IQueryable<User> IsActive()
        {
            return query.Where(u => u.IsActive).IsNotDeleted();
        }

        public IQueryable<User> IsInactive()
        {
            return query.Where(u => !u.IsActive).IsNotDeleted();
        }

        public IQueryable<User> IsNotDeleted()
        {
            return query.Where(u => !u.IsDeleted);
        }
    }
}
