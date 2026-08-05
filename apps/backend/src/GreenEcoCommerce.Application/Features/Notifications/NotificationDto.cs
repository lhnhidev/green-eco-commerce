using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Notifications;

public record NotificationDto(
    Guid Id,
    string Title,
    string Message,
    NotificationTypeEnum Type,
    string? Link,
    bool IsRead,
    DateTimeOffset CreatedAt
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class NotificationDtoMapper
{
    public static partial NotificationDto ToDto(this Notification notification);
    public static partial IQueryable<NotificationDto> ProjectToDto(this IQueryable<Notification> notifications);
}
