using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Infrastructure.Caching;
using GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Caching;

[Collection("Redis")]
public class RedisCacheServiceTests(RedisFixture redis)
{
    private ICacheService CreateService() => new RedisCacheService(redis.CreateDistributedCache());

    // ── Set & Get ────────────────────────────────────────────────────────────

    [Fact]
    public async Task SetAndGet_ShouldReturnStoredValue()
    {
        // Arrange
        var sut = CreateService();
        const string key = "test:string:1";
        const string value = "Hello Redis";

        // Act
        await sut.SetAsync(key, value);
        var result = await sut.GetAsync<string>(key);

        // Assert
        Assert.Equal(value, result);
    }

    [Fact]
    public async Task Get_NonExistentKey_ShouldReturnDefault()
    {
        // Arrange
        var sut = CreateService();

        // Act
        var result = await sut.GetAsync<string>("non_existent_key");

        // Assert
        Assert.Null(result);
    }

    // ── Expiration ───────────────────────────────────────────────────────────

    [Fact]
    public async Task Set_WithExpiration_ShouldExpire()
    {
        // Arrange
        var sut = CreateService();
        const string key = "test:expire:1";

        // Act — set with 1-second TTL
        await sut.SetAsync(key, "temporary", TimeSpan.FromSeconds(1));

        // Wait for expiration
        await Task.Delay(TimeSpan.FromSeconds(2));

        var result = await sut.GetAsync<string>(key);

        // Assert
        Assert.Null(result);
    }

    // ── Remove ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task Remove_ShouldDeleteKey()
    {
        // Arrange
        var sut = CreateService();
        const string key = "test:remove:1";
        await sut.SetAsync(key, "to_be_deleted");

        // Act
        await sut.RemoveAsync(key);
        var result = await sut.GetAsync<string>(key);

        // Assert
        Assert.Null(result);
    }

    // ── IsLive ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task IsLive_ExistingKey_ShouldReturnTrue()
    {
        // Arrange
        var sut = CreateService();
        const string key = "test:islive:1";
        await sut.SetAsync(key, "alive");

        // Act
        bool isLive = await sut.IsLiveAsync(key);

        // Assert
        Assert.True(isLive);
    }

    [Fact]
    public async Task IsLive_NonExistentKey_ShouldReturnFalse()
    {
        // Arrange
        var sut = CreateService();

        // Act
        bool isLive = await sut.IsLiveAsync("non_existent_key_islive");

        // Assert
        Assert.False(isLive);
    }

    // ── Complex Object ───────────────────────────────────────────────────────

    [Fact]
    public async Task Set_ComplexObject_ShouldSerializeAndDeserialize()
    {
        // Arrange
        var sut = CreateService();
        const string key = "test:complex:1";
        var dto = new TestDto("green-eco", 42, true);

        // Act
        await sut.SetAsync(key, dto);
        var result = await sut.GetAsync<TestDto>(key);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Name, result.Name);
        Assert.Equal(dto.Value, result.Value);
        Assert.Equal(dto.IsActive, result.IsActive);
    }

    // ── Overwrite ────────────────────────────────────────────────────────────

    [Fact]
    public async Task Set_OverwriteExistingKey_ShouldUpdateValue()
    {
        // Arrange
        var sut = CreateService();
        const string key = "test:overwrite:1";
        await sut.SetAsync(key, "first_value");

        // Act
        await sut.SetAsync(key, "second_value");
        var result = await sut.GetAsync<string>(key);

        // Assert
        Assert.Equal("second_value", result);
    }

    // ── Helper DTO for complex object tests ──────────────────────────────────

    private record TestDto(string Name, int Value, bool IsActive);
}
