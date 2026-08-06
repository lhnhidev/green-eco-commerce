using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Users.Queries;

public enum UserSortBy
{
    FirstName,
    LastName,
    Points
}

public record GetAllUsersQuery(GetAllUsersQuery.Parameters Query) : IRequest<PagedResult<UserDto>>
{
    public class GetAmountAllUsersQueryHandler(IApplicationDbContext dbContext)
            : IRequestHandler<GetAllUsersQuery, PagedResult<UserDto>>
    {
        public async Task<PagedResult<UserDto>> Handle(GetAllUsersQuery request, CancellationToken ct)
        {
            var userQuery = dbContext.Users.IsNotDeleted();
            return await request.Query.ApplyAsync(userQuery, UserDtoMapper.ProjectToDto, ct);
        }
    }

    public class Parameters : QueryParameters<User>, ISortParameters<User>, ISearchParameters<User>,
                              IFilterParameters<User>
    {
        public UserSortBy? SortBy { get; init; } = UserSortBy.FirstName;
        public bool? SortDescending { get; init; }

        public string? Search { get; init; } = string.Empty;

        public RoleEnum? Role { get; init; }
        public bool? IsActive { get; init; }

        public IQueryable<User> ApplySearching(IQueryable<User> query)
        {
            if (string.IsNullOrWhiteSpace(Search)) return query;

            string search = Search.Trim().ToLower();

            return query.Where(p =>
                    (p.LastName + " " + p.FirstName).ToLower().Contains(search) ||
                    (p.FirstName + " " + p.LastName).ToLower().Contains(search) ||
                    p.Email.ToString().ToLower().Contains(search) || p.Phone.ToString().Contains(search));
        }

        public IQueryable<User> ApplyFiltering(IQueryable<User> query)
        {
            if (Role.HasValue) { query = query.Where(u => u.Role == Role.Value); }
            if (IsActive.HasValue) { query = query.Where(u => u.IsActive == IsActive.Value); }
            return query;
        }

        public IQueryable<User> ApplySorting(IQueryable<User> query)
        {
            return SortBy switch
            {
                UserSortBy.FirstName => query.ApplySorting(p => p.FirstName, SortDescending),
                UserSortBy.LastName => query.ApplySorting(p => p.LastName, SortDescending),
                UserSortBy.Points => query.ApplySorting(p => p.GreenWallet.EarnedTotal, SortDescending),
                _ => query.ApplySorting(p => p.Id, SortDescending) // default
            };
        }
    }
}
