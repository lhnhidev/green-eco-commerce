using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Users.Commands;

public class CreateUserCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<UserPayloadDto, UserDto>
{
    public async Task<UserDto> Handle(UserPayloadDto command, CancellationToken ct)
    {
        var email = Email.From(command.Email);
        var phone = PhoneNumber.From(command.Phone);

        bool emailExist = await dbContext.Users.AnyAsync(u => u.Email == email, ct);
        if (emailExist) { throw new BadRequestException("Email was exist"); }

        bool phoneExist = await dbContext.Users.AnyAsync(u => u.Phone == phone, ct);
        if (phoneExist) { throw new BadRequestException("Phone was exist"); }

        var user = command.ToEntity();
        await dbContext.Users.AddAsync(user, ct);

        if (user.Role == RoleEnum.User)
        {
            await dbContext.GreenWallets.AddAsync(new GreenWallet { UserId = user.Id }, ct);
            await dbContext.Carts.AddAsync(new Cart { UserId = user.Id }, ct);
        }

        await dbContext.SaveChangesAsync(ct);
        return user.ToDto();
    }
}
