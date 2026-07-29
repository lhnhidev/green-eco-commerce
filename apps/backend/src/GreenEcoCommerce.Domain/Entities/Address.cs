using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Address : IHasCreatedAt, IHasUpdatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public required string Label { get; set; }
    public required string RecipientName { get; set; }
    public required string Phone { get; set; }
    public required string FormattedAddress { get; set; }
    public string? Commune { get; set; }
    public string? Province { get; set; }
    public string? PlaceId { get; set; }
    public bool IsDefault { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}
