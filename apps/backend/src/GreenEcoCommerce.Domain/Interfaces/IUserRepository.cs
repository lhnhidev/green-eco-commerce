using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces
{
    public interface IUserRepository
    {
        public Task<User?> GetUserByIdAsync(Guid id);
        public Task<User?> GetUserByEmailAsync(string email);
        public Task SaveChangesAsync();
    }
}
