using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class UserRepository(IApplicationDbContext context) : IUserRepository
{
    public async Task<Guid> AddUserAsync(User user)
    {
        await context.Users.AddAsync(user);
        await SaveChangesAsync();
        return user.Id;
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
        Console.WriteLine(user.Id);

        int rowAffected = await context.Users
            .Where(u => u.Id == user.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.Avatar, user.Avatar)
                .SetProperty(u => u.FirstName, user.FirstName)
                .SetProperty(u => u.LastName, user.LastName)
                .SetProperty(u => u.Email, user.Email)
                .SetProperty(u => u.Phone, user.Phone)
                .SetProperty(u => u.Address, user.Address)
            );

        return rowAffected > 0;
    }

    public async Task<bool> EmailUserExist(string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == (Email)email);
        return user != null;
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == (Email)email);
        return user;
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        var user = await context.Users.FindAsync(id);
        return user;
    }

    public async Task<bool> PhoneNumberUserExist(string phone)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Phone == (PhoneNumber)phone);

        return user != null;
    }

    public async Task SaveChangesAsync()
    {
        await context.SaveChangesAsync();
    }
}
