using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.UnitTests.Entities;

public class CategoryTests
{
    // -----------------------------------------------------------------------
    // Default construction — Id
    // -----------------------------------------------------------------------

    [Fact]
    public void Category_DefaultConstructor_ShouldInitializeId()
    {
        // Act
        var category = new Category { Name = "Electronics" };

        // Assert
        Assert.NotEqual(Guid.Empty, category.Id);
    }

    // -----------------------------------------------------------------------
    // Default construction — collections
    // -----------------------------------------------------------------------

    [Fact]
    public void Category_DefaultConstructor_ShouldInitializeEmptyChildCategories()
    {
        // Act
        var category = new Category { Name = "Electronics" };

        // Assert
        Assert.NotNull(category.ChildCategories);
        Assert.Empty(category.ChildCategories);
    }

    [Fact]
    public void Category_DefaultConstructor_ShouldInitializeEmptyProducts()
    {
        // Act
        var category = new Category { Name = "Electronics" };

        // Assert
        Assert.NotNull(category.Products);
        Assert.Empty(category.Products);
    }

    // -----------------------------------------------------------------------
    // Id uniqueness
    // -----------------------------------------------------------------------

    [Fact]
    public void Category_Id_ShouldBeUniquePerInstance()
    {
        // Act
        var cat1 = new Category { Name = "A" };
        var cat2 = new Category { Name = "B" };

        // Assert — Guid.CreateVersion7() is monotonic but always unique
        Assert.NotEqual(cat1.Id, cat2.Id);
    }

    // -----------------------------------------------------------------------
    // Name
    // -----------------------------------------------------------------------

    [Fact]
    public void Category_Name_ShouldAcceptValidValue()
    {
        // Arrange
        const string expectedName = "Organic Food";

        // Act
        var category = new Category { Name = expectedName };

        // Assert
        Assert.Equal(expectedName, category.Name);
    }

    // -----------------------------------------------------------------------
    // Nullable defaults
    // -----------------------------------------------------------------------

    [Fact]
    public void Category_Description_ShouldBeNullByDefault()
    {
        // Act — Description is not set, so it should default to null
        var category = new Category { Name = "No Description" };

        // Assert
        Assert.Null(category.Description);
    }

    [Fact]
    public void Category_ParentId_ShouldBeNullByDefault()
    {
        // Act
        var category = new Category { Name = "Root Category" };

        // Assert
        Assert.Null(category.ParentId);
    }

    // -----------------------------------------------------------------------
    // ParentId assignment
    // -----------------------------------------------------------------------

    [Fact]
    public void Category_CanSetParentId()
    {
        // Arrange
        var parent = new Category { Name = "Parent" };
        var child = new Category { Name = "Child", ParentId = parent.Id };

        // Assert
        Assert.Equal(parent.Id, child.ParentId);
    }

    // -----------------------------------------------------------------------
    // ChildCategories relationship
    // -----------------------------------------------------------------------

    [Fact]
    public void Category_CanHaveChildCategories()
    {
        // Arrange
        var parent = new Category { Name = "Parent" };
        var child1 = new Category { Name = "Child 1", ParentId = parent.Id };
        var child2 = new Category { Name = "Child 2", ParentId = parent.Id };

        // Act
        parent.ChildCategories.Add(child1);
        parent.ChildCategories.Add(child2);

        // Assert
        Assert.Equal(2, parent.ChildCategories.Count);
        Assert.Contains(child1, parent.ChildCategories);
        Assert.Contains(child2, parent.ChildCategories);
    }
}
