using System.Security.Claims;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Features.Notifications;
using GreenEcoCommerce.Application.Features.Notifications.Commands;
using GreenEcoCommerce.Application.Features.Notifications.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class NotificationEndpoints
{
    public static void MapNotificationEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/me/notifications")
            .WithTags("Notifications")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .RequireAuthorization();

        group.MapGet("/", GetMyNotifications);
        group.MapGet("/unread-count", GetUnreadCount);
        group.MapPatch("/{id:guid}/read", MarkRead);
        group.MapPatch("/read-all", MarkAllRead);
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var claim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null || !Guid.TryParse(claim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID in token");
        }
        return userId;
    }

    private static async Task<Ok<PagedResult<NotificationDto>>> GetMyNotifications(
        ClaimsPrincipal user, [AsParameters] GetMyNotificationsQuery.Parameters query, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new GetMyNotificationsQuery(userId, query));
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<int>> GetUnreadCount(ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var count = await sender.Send(new GetUnreadNotificationCountQuery(userId));
        return TypedResults.Ok(count);
    }

    private static async Task<NoContent> MarkRead(Guid id, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new MarkNotificationReadCommand(id, userId));
        return TypedResults.NoContent();
    }

    private static async Task<NoContent> MarkAllRead(ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new MarkAllNotificationsReadCommand(userId));
        return TypedResults.NoContent();
    }
}
