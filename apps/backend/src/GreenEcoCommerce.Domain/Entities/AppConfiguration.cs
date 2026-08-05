using System.Text.Json;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class AppConfiguration: IHasUpdatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required string Key { get; set; }
    public required JsonDocument Value { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
