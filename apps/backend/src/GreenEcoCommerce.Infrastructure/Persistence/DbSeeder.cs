using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;
using GreenEcoCommerce.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Run migrations first
        await context.Database.MigrateAsync();

        // Seed in dependency order
        await SeedCategoriesAsync(context);
        await SeedMaterialsAsync(context);
        await SeedProductsAsync(context);
        await SeedUsersAsync(context);
        await SeedCartsAsync(context);
        await SeedGreenWalletsAsync(context);
        await SeedOrdersAsync(context);
        await SeedPaymentsAsync(context);
        await SeedPointTransactionsAsync(context);
        await SeedCartItemsAsync(context);
        await SeedOrderItemsAsync(context);
    }

    // ────────────────────────────────────────────────────────────────────
    // CATEGORIES
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedCategoriesAsync(ApplicationDbContext context)
    {
        if (await context.Categories.AnyAsync()) return;

        // Root categories
        var personalCare = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000001"),
            Name = "Personal Care",
            Description = "Eco-friendly personal care and hygiene products"
        };
        var kitchenHome = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000002"),
            Name = "Kitchen & Home",
            Description = "Sustainable kitchen and household essentials"
        };
        var fashion = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000003"),
            Name = "Eco Fashion",
            Description = "Clothing and accessories made from organic or recycled materials"
        };
        var outdoorTravel = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000004"),
            Name = "Outdoor & Travel",
            Description = "Zero-waste travel and outdoor gear"
        };
        var foodBeverages = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000005"),
            Name = "Food & Beverages",
            Description = "Organic and sustainably sourced food and drinks"
        };

        context.Categories.AddRange(personalCare, kitchenHome, fashion, outdoorTravel, foodBeverages);

        // Child categories
        var dentalCare = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000011"),
            ParentId = personalCare.Id,
            Name = "Dental Care",
            Description = "Natural and plastic-free dental hygiene products"
        };
        var skinCare = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000012"),
            ParentId = personalCare.Id,
            Name = "Skin Care",
            Description = "Organic and cruelty-free skincare"
        };
        var reusableKitchen = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000013"),
            ParentId = kitchenHome.Id,
            Name = "Reusable Kitchen",
            Description = "Reusable bags, wraps and containers"
        };
        var cleaningProducts = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000014"),
            ParentId = kitchenHome.Id,
            Name = "Cleaning Products",
            Description = "Biodegradable cleaning and household products"
        };
        var organicClothing = new Category
        {
            Id = new Guid("11000000-0000-0000-0000-000000000015"),
            ParentId = fashion.Id,
            Name = "Organic Clothing",
            Description = "T-shirts, hoodies and basics made from organic cotton or recycled fibres"
        };

        context.Categories.AddRange(dentalCare, skinCare, reusableKitchen, cleaningProducts, organicClothing);

        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // MATERIALS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedMaterialsAsync(ApplicationDbContext context)
    {
        if (await context.Materials.AnyAsync()) return;

        var materials = new List<Material>
        {
            new() { Id = new Guid("22000000-0000-0000-0000-000000000001"), Name = "Bamboo",               Type = MaterialTypeEnum.Natural,      EcoRating = 9 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000002"), Name = "Organic Cotton",       Type = MaterialTypeEnum.Organic,      EcoRating = 8 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000003"), Name = "Recycled PET",         Type = MaterialTypeEnum.Recycled,     EcoRating = 8 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000004"), Name = "Beeswax",              Type = MaterialTypeEnum.Natural,      EcoRating = 7 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000005"), Name = "Hemp",                 Type = MaterialTypeEnum.Organic,      EcoRating = 9 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000006"), Name = "Cork",                 Type = MaterialTypeEnum.Natural,      EcoRating = 8 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000007"), Name = "Cornstarch PLA",       Type = MaterialTypeEnum.BioBased,     EcoRating = 7 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000008"), Name = "Stainless Steel 304",  Type = MaterialTypeEnum.Recycled,     EcoRating = 6 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000009"), Name = "Coconut Shell",        Type = MaterialTypeEnum.Biodegradable,EcoRating = 9 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000010"), Name = "Jute",                 Type = MaterialTypeEnum.Natural,      EcoRating = 8 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000011"), Name = "Recycled Cardboard",   Type = MaterialTypeEnum.Recycled,     EcoRating = 7 },
            new() { Id = new Guid("22000000-0000-0000-0000-000000000012"), Name = "Soy Wax",              Type = MaterialTypeEnum.Compostable,  EcoRating = 7 },
        };

        context.Materials.AddRange(materials);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // PRODUCTS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedProductsAsync(ApplicationDbContext context)
    {
        if (await context.Products.AnyAsync()) return;

        var products = new List<Product>
        {
            // ── Dental Care (11)
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000001"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000011"),
                Name = "Bamboo Toothbrush Pack (4x)",
                Description = "Four adult bamboo toothbrushes with BPA-free bristles and a biodegradable handle. Certified by FSC-certified bamboo plantation.",
                Price = 89_000m,
                StockQty = 250,
                CarbonIndex = 0.05m,
                BaselineCarbonIndex = 0.35m,
                DecomposePercent = 95m,
                RecyclePercent = 80m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80",
                    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000002"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000011"),
                Name = "Natural Charcoal Toothpaste",
                Description = "Whitening toothpaste with activated charcoal and coconut oil. Free of SLS, fluoride, and microplastics. Comes in a glass jar.",
                Price = 125_000m,
                StockQty = 180,
                CarbonIndex = 0.12m,
                BaselineCarbonIndex = 0.60m,
                DecomposePercent = 70m,
                RecyclePercent = 90m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1588776814546-1ffbb4d99c1f?w=800&q=80",
                    "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000003"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000011"),
                Name = "Silk Dental Floss (Refillable)",
                Description = "100% natural silk floss coated with candelilla wax. Comes in a refillable stainless-steel dispenser.",
                Price = 75_000m,
                StockQty = 130,
                CarbonIndex = 0.03m,
                BaselineCarbonIndex = 0.25m,
                DecomposePercent = 90m,
                RecyclePercent = 85m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1559591937-abc5e38fa7e8?w=800&q=80"
                },
                IsActive = true
            },

            // ── Skin Care (12)
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000004"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000012"),
                Name = "Organic Aloe Vera Gel",
                Description = "Pure 99.5% aloe vera gel in a recyclable glass bottle. Certified USDA Organic. Soothes and moisturises naturally.",
                Price = 145_000m,
                StockQty = 200,
                CarbonIndex = 0.08m,
                BaselineCarbonIndex = 0.40m,
                DecomposePercent = 85m,
                RecyclePercent = 90m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80",
                    "https://images.unsplash.com/photo-1556760544-74068565f05c?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000005"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000012"),
                Name = "Solid Shampoo Bar - Lavender",
                Description = "Zero-plastic shampoo bar made with organic lavender oil and shea butter. One bar equals ~3 bottles of liquid shampoo.",
                Price = 110_000m,
                StockQty = 320,
                CarbonIndex = 0.06m,
                BaselineCarbonIndex = 0.80m,
                DecomposePercent = 88m,
                RecyclePercent = 95m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?w=800&q=80",
                    "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&q=80"
                },
                IsActive = true
            },

            // ── Reusable Kitchen (13)
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000006"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000013"),
                Name = "Beeswax Food Wraps (Set of 3)",
                Description = "Reusable beeswax food wraps in three sizes. Replaces cling film. Washable and compostable at end of life.",
                Price = 165_000m,
                StockQty = 140,
                CarbonIndex = 0.10m,
                BaselineCarbonIndex = 0.90m,
                DecomposePercent = 100m,
                RecyclePercent = 0m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1610824224971-b3a0de944af1?w=800&q=80",
                    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000007"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000013"),
                Name = "Organic Cotton Produce Bags (5-Pack)",
                Description = "Lightweight mesh produce bags made from organic cotton. Machine washable. Perfect for fruits, veggies, and bulk goods.",
                Price = 95_000m,
                StockQty = 400,
                CarbonIndex = 0.07m,
                BaselineCarbonIndex = 0.50m,
                DecomposePercent = 95m,
                RecyclePercent = 80m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1610824224971-b3a0de944af1?w=800&q=80",
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000008"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000013"),
                Name = "Stainless Steel Lunch Box",
                Description = "Leak-proof 3-compartment stainless steel lunch box. BPA-free, durable, and perfect for reducing single-use plastics.",
                Price = 280_000m,
                StockQty = 90,
                CarbonIndex = 0.45m,
                BaselineCarbonIndex = 2.00m,
                DecomposePercent = 0m,
                RecyclePercent = 100m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1536304993881-ff86e1f3f5ce?w=800&q=80",
                    "https://images.unsplash.com/photo-1548940740-204726a19be3?w=800&q=80"
                },
                IsActive = true
            },

            // ── Cleaning Products (14)
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000009"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000014"),
                Name = "Biodegradable Dish Soap Bar",
                Description = "Concentrated dish soap bar that replaces 4 bottles of liquid dish soap. Palm-oil free and vegan.",
                Price = 72_000m,
                StockQty = 350,
                CarbonIndex = 0.04m,
                BaselineCarbonIndex = 0.55m,
                DecomposePercent = 100m,
                RecyclePercent = 0m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1585652757141-25a2d2d5b06f?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000010"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000014"),
                Name = "Coconut Fibre Scrub Brush",
                Description = "Kitchen scrubbing brush with a sustainably sourced wooden handle and coconut coir bristles. 100% biodegradable.",
                Price = 55_000m,
                StockQty = 220,
                CarbonIndex = 0.03m,
                BaselineCarbonIndex = 0.30m,
                DecomposePercent = 100m,
                RecyclePercent = 0m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
                    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000011"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000014"),
                Name = "All-Purpose Cleaning Tablets (30-Pack)",
                Description = "Concentrated cleaning tablets. Dissolve in water to make a full bottle of multi-surface cleaner. Reduces plastic waste by 90%.",
                Price = 190_000m,
                StockQty = 160,
                CarbonIndex = 0.09m,
                BaselineCarbonIndex = 1.20m,
                DecomposePercent = 100m,
                RecyclePercent = 70m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80"
                },
                IsActive = true
            },

            // ── Organic Clothing (15)
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000012"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000015"),
                Name = "Organic Cotton Tote Bag",
                Description = "Heavy-duty grocery tote bag made from GOTS-certified organic cotton canvas. One bag replaces hundreds of single-use plastic bags.",
                Price = 120_000m,
                StockQty = 500,
                CarbonIndex = 0.80m,
                BaselineCarbonIndex = 6.00m,
                DecomposePercent = 95m,
                RecyclePercent = 85m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
                    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000013"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000015"),
                Name = "Recycled PET Fleece Jacket",
                Description = "Warm fleece jacket made from 100% recycled plastic bottles. Each jacket repurposes ~25 500ml bottles.",
                Price = 850_000m,
                StockQty = 60,
                CarbonIndex = 1.80m,
                BaselineCarbonIndex = 7.00m,
                DecomposePercent = 30m,
                RecyclePercent = 90m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
                },
                IsActive = true
            },
            new()
            {
                Id = new Guid("33000000-0000-0000-0000-000000000014"),
                CategoryId = new Guid("11000000-0000-0000-0000-000000000015"),
                Name = "Hemp Canvas Backpack",
                Description = "Durable backpack woven from natural hemp canvas with vegan leather accents. Water-resistant and ethically manufactured.",
                Price = 650_000m,
                StockQty = 75,
                CarbonIndex = 0.90m,
                BaselineCarbonIndex = 4.50m,
                DecomposePercent = 80m,
                RecyclePercent = 60m,
                ImageUrl = new[]
                {
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
                    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80"
                },
                IsActive = true
            },
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();

        // Attach Materials to Products (many-to-many)
        var bamboo    = await context.Materials.FindAsync(new Guid("22000000-0000-0000-0000-000000000001"));
        var orgCotton = await context.Materials.FindAsync(new Guid("22000000-0000-0000-0000-000000000002"));
        var recycPET  = await context.Materials.FindAsync(new Guid("22000000-0000-0000-0000-000000000003"));
        var beeswax   = await context.Materials.FindAsync(new Guid("22000000-0000-0000-0000-000000000004"));
        var hemp      = await context.Materials.FindAsync(new Guid("22000000-0000-0000-0000-000000000005"));
        var stainless = await context.Materials.FindAsync(new Guid("22000000-0000-0000-0000-000000000008"));
        var coconut   = await context.Materials.FindAsync(new Guid("22000000-0000-0000-0000-000000000009"));

        var productEntries = await context.Products.Include(p => p.Materials).ToListAsync();

        void AddMaterials(Guid productId, params Material[] mats)
        {
            var prod = productEntries.First(p => p.Id == productId);
            foreach (var m in mats) prod.Materials.Add(m!);
        }

        AddMaterials(new Guid("33000000-0000-0000-0000-000000000001"), bamboo!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000002"), coconut!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000004"), orgCotton!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000005"), orgCotton!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000006"), beeswax!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000007"), orgCotton!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000008"), stainless!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000009"), coconut!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000012"), orgCotton!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000013"), recycPET!);
        AddMaterials(new Guid("33000000-0000-0000-0000-000000000014"), hemp!);

        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // USERS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedUsersAsync(ApplicationDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        // Credentials: admin@greeneco.vn / Admin@123 | all users / User@1234
        var adminHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
        var userHash  = BCrypt.Net.BCrypt.HashPassword("User@1234");

        var users = new List<User>
        {
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000001"),
                Email = Email.From("admin@greeneco.vn"),
                PasswordHash = adminHash,
                FirstName = "Eco",
                LastName = "Admin",
                Phone = PhoneNumber.From("0901234567"),
                Address = "123 Nguyen Hue, District 1, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
                Role = RoleEnum.Admin,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-180)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000002"),
                Email = Email.From("nguyen.thi.lan@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Lan",
                LastName = "Nguyen Thi",
                Phone = PhoneNumber.From("0912345678"),
                Address = "45 Le Loi, District 3, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-120)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000003"),
                Email = Email.From("tran.van.minh@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Minh",
                LastName = "Tran Van",
                Phone = PhoneNumber.From("0923456789"),
                Address = "78 Tran Hung Dao, District 5, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-90)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000004"),
                Email = Email.From("pham.thi.hoa@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Hoa",
                LastName = "Pham Thi",
                Phone = PhoneNumber.From("0934567890"),
                Address = "12 Dinh Tien Hoang, Binh Thanh District, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-75)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000005"),
                Email = Email.From("le.van.duc@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Duc",
                LastName = "Le Van",
                Phone = PhoneNumber.From("0945678901"),
                Address = "56 Nguyen Thi Minh Khai, District 1, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-60)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000006"),
                Email = Email.From("vo.thi.mai@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Mai",
                LastName = "Vo Thi",
                Phone = PhoneNumber.From("0956789012"),
                Address = "30 Pasteur, District 1, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-50)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000007"),
                Email = Email.From("hoang.van.tuan@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Tuan",
                LastName = "Hoang Van",
                Phone = PhoneNumber.From("0967890123"),
                Address = "89 Ly Tu Trong, District 1, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-40)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000008"),
                Email = Email.From("dang.thi.linh@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Linh",
                LastName = "Dang Thi",
                Phone = PhoneNumber.From("0978901234"),
                Address = "25 Vo Van Tan, District 3, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-30)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000009"),
                Email = Email.From("bui.van.long@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Long",
                LastName = "Bui Van",
                Phone = PhoneNumber.From("0989012345"),
                Address = "67 Nguyen Du, District 1, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-20)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000010"),
                Email = Email.From("do.thi.thu@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Thu",
                LastName = "Do Thi",
                Phone = PhoneNumber.From("0390123456"),
                Address = "34 Hai Ba Trung, District 1, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-10)
            },
            new()
            {
                Id = new Guid("44000000-0000-0000-0000-000000000011"),
                Email = Email.From("nguyen.van.khanh@gmail.com"),
                PasswordHash = userHash,
                FirstName = "Khanh",
                LastName = "Nguyen Van",
                Phone = PhoneNumber.From("0398765432"),
                Address = "101 Cach Mang Thang 8, District 10, Ho Chi Minh City",
                Avatar = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80",
                Role = RoleEnum.User,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-5)
            },
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // CARTS (one per user)
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedCartsAsync(ApplicationDbContext context)
    {
        if (await context.Carts.AnyAsync()) return;

        var carts = Enumerable.Range(1, 11).Select(i => new Cart
        {
            Id = new Guid($"55000000-0000-0000-0000-{i:D12}"),
            UserId = new Guid($"44000000-0000-0000-0000-{i:D12}"),
            UpdatedAt = DateTimeOffset.UtcNow
        }).ToList();

        context.Carts.AddRange(carts);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // GREEN WALLETS (one per user)
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedGreenWalletsAsync(ApplicationDbContext context)
    {
        if (await context.GreenWallets.AnyAsync()) return;

        var wallets = new List<GreenWallet>
        {
            new() { Id = new Guid("66000000-0000-0000-0000-000000000001"), UserId = new Guid("44000000-0000-0000-0000-000000000001"), Balance = 500, EarnedTotal = 500  },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000002"), UserId = new Guid("44000000-0000-0000-0000-000000000002"), Balance = 320, EarnedTotal = 420  },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000003"), UserId = new Guid("44000000-0000-0000-0000-000000000003"), Balance = 150, EarnedTotal = 250  },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000004"), UserId = new Guid("44000000-0000-0000-0000-000000000004"), Balance = 200, EarnedTotal = 300  },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000005"), UserId = new Guid("44000000-0000-0000-0000-000000000005"), Balance = 75,  EarnedTotal = 75   },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000006"), UserId = new Guid("44000000-0000-0000-0000-000000000006"), Balance = 400, EarnedTotal = 600  },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000007"), UserId = new Guid("44000000-0000-0000-0000-000000000007"), Balance = 50,  EarnedTotal = 50   },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000008"), UserId = new Guid("44000000-0000-0000-0000-000000000008"), Balance = 180, EarnedTotal = 280  },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000009"), UserId = new Guid("44000000-0000-0000-0000-000000000009"), Balance = 90,  EarnedTotal = 90   },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000010"), UserId = new Guid("44000000-0000-0000-0000-000000000010"), Balance = 110, EarnedTotal = 110  },
            new() { Id = new Guid("66000000-0000-0000-0000-000000000011"), UserId = new Guid("44000000-0000-0000-0000-000000000011"), Balance = 25,  EarnedTotal = 25   },
        };

        context.GreenWallets.AddRange(wallets);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // ORDERS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedOrdersAsync(ApplicationDbContext context)
    {
        if (await context.Orders.AnyAsync()) return;

        var orders = new List<Order>
        {
            new() { Id = new Guid("77000000-0000-0000-0000-000000000001"), UserId = new Guid("44000000-0000-0000-0000-000000000002"), Status = OrderStatusEnum.Delivered,  DeliveryAddress = "45 Le Loi, District 3, Ho Chi Minh City",                    DiscountAmount = 0m,       EarnedPoints = 25m, CreatedAt = DateTimeOffset.UtcNow.AddDays(-90) },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000002"), UserId = new Guid("44000000-0000-0000-0000-000000000002"), Status = OrderStatusEnum.Delivered,  DeliveryAddress = "45 Le Loi, District 3, Ho Chi Minh City",                    DiscountAmount = 50_000m,  EarnedPoints = 40m, CreatedAt = DateTimeOffset.UtcNow.AddDays(-60) },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000003"), UserId = new Guid("44000000-0000-0000-0000-000000000003"), Status = OrderStatusEnum.Delivered,  DeliveryAddress = "78 Tran Hung Dao, District 5, Ho Chi Minh City",            DiscountAmount = 0m,       EarnedPoints = 15m, CreatedAt = DateTimeOffset.UtcNow.AddDays(-80) },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000004"), UserId = new Guid("44000000-0000-0000-0000-000000000004"), Status = OrderStatusEnum.Packing,    DeliveryAddress = "12 Dinh Tien Hoang, Binh Thanh District, Ho Chi Minh City", DiscountAmount = 0m,       EarnedPoints = 20m, CreatedAt = DateTimeOffset.UtcNow.AddDays(-3)  },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000005"), UserId = new Guid("44000000-0000-0000-0000-000000000005"), Status = OrderStatusEnum.Pending,    DeliveryAddress = "56 Nguyen Thi Minh Khai, District 1, Ho Chi Minh City",   DiscountAmount = 0m,       EarnedPoints = 8m,  CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)  },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000006"), UserId = new Guid("44000000-0000-0000-0000-000000000006"), Status = OrderStatusEnum.Delivered,  DeliveryAddress = "30 Pasteur, District 1, Ho Chi Minh City",                  DiscountAmount = 100_000m, EarnedPoints = 60m, CreatedAt = DateTimeOffset.UtcNow.AddDays(-45) },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000007"), UserId = new Guid("44000000-0000-0000-0000-000000000007"), Status = OrderStatusEnum.Delivering, DeliveryAddress = "89 Ly Tu Trong, District 1, Ho Chi Minh City",              DiscountAmount = 0m,       EarnedPoints = 10m, CreatedAt = DateTimeOffset.UtcNow.AddDays(-2)  },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000008"), UserId = new Guid("44000000-0000-0000-0000-000000000008"), Status = OrderStatusEnum.Cancelled,  DeliveryAddress = "25 Vo Van Tan, District 3, Ho Chi Minh City",               DiscountAmount = 0m,       EarnedPoints = 0m,  CreatedAt = DateTimeOffset.UtcNow.AddDays(-15) },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000009"), UserId = new Guid("44000000-0000-0000-0000-000000000009"), Status = OrderStatusEnum.Delivered,  DeliveryAddress = "67 Nguyen Du, District 1, Ho Chi Minh City",                DiscountAmount = 25_000m,  EarnedPoints = 9m,  CreatedAt = DateTimeOffset.UtcNow.AddDays(-20) },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000010"), UserId = new Guid("44000000-0000-0000-0000-000000000010"), Status = OrderStatusEnum.Packing,    DeliveryAddress = "34 Hai Ba Trung, District 1, Ho Chi Minh City",             DiscountAmount = 0m,       EarnedPoints = 11m, CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)  },
            new() { Id = new Guid("77000000-0000-0000-0000-000000000011"), UserId = new Guid("44000000-0000-0000-0000-000000000011"), Status = OrderStatusEnum.Pending,    DeliveryAddress = "101 Cach Mang Thang 8, District 10, Ho Chi Minh City",     DiscountAmount = 0m,       EarnedPoints = 5m,  CreatedAt = DateTimeOffset.UtcNow              },
        };

        context.Orders.AddRange(orders);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // PAYMENTS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedPaymentsAsync(ApplicationDbContext context)
    {
        if (await context.Payments.AnyAsync()) return;

        var payments = new List<Payment>
        {
            new() { Id = new Guid("88000000-0000-0000-0000-000000000001"), OrderId = new Guid("77000000-0000-0000-0000-000000000001"), Method = PaymentMethodEnum.Bank,  Status = PaymentStatusEnum.Paid,     Amount = 254_000m, TransactionRef = "TXN-20260401-001", CreatedAt = DateTimeOffset.UtcNow.AddDays(-90) },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000002"), OrderId = new Guid("77000000-0000-0000-0000-000000000002"), Method = PaymentMethodEnum.MoMo,  Status = PaymentStatusEnum.Paid,     Amount = 390_000m, TransactionRef = "TXN-20260501-002", CreatedAt = DateTimeOffset.UtcNow.AddDays(-60) },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000003"), OrderId = new Guid("77000000-0000-0000-0000-000000000003"), Method = PaymentMethodEnum.COD,   Status = PaymentStatusEnum.Paid,     Amount = 165_000m, TransactionRef = "TXN-20260411-003", CreatedAt = DateTimeOffset.UtcNow.AddDays(-80) },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000004"), OrderId = new Guid("77000000-0000-0000-0000-000000000004"), Method = PaymentMethodEnum.Bank,  Status = PaymentStatusEnum.Pending,  Amount = 280_000m, TransactionRef = "TXN-20260716-004", CreatedAt = DateTimeOffset.UtcNow.AddDays(-3)  },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000005"), OrderId = new Guid("77000000-0000-0000-0000-000000000005"), Method = PaymentMethodEnum.MoMo,  Status = PaymentStatusEnum.Pending,  Amount = 89_000m,  TransactionRef = "TXN-20260718-005", CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)  },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000006"), OrderId = new Guid("77000000-0000-0000-0000-000000000006"), Method = PaymentMethodEnum.Bank,  Status = PaymentStatusEnum.Paid,     Amount = 820_000m, TransactionRef = "TXN-20260604-006", CreatedAt = DateTimeOffset.UtcNow.AddDays(-45) },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000007"), OrderId = new Guid("77000000-0000-0000-0000-000000000007"), Method = PaymentMethodEnum.COD,   Status = PaymentStatusEnum.Pending,  Amount = 110_000m, TransactionRef = "TXN-20260717-007", CreatedAt = DateTimeOffset.UtcNow.AddDays(-2)  },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000008"), OrderId = new Guid("77000000-0000-0000-0000-000000000008"), Method = PaymentMethodEnum.MoMo,  Status = PaymentStatusEnum.Refunded, Amount = 195_000m, TransactionRef = "TXN-20260704-008", CreatedAt = DateTimeOffset.UtcNow.AddDays(-15) },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000009"), OrderId = new Guid("77000000-0000-0000-0000-000000000009"), Method = PaymentMethodEnum.Bank,  Status = PaymentStatusEnum.Paid,     Amount = 127_000m, TransactionRef = "TXN-20260629-009", CreatedAt = DateTimeOffset.UtcNow.AddDays(-20) },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000010"), OrderId = new Guid("77000000-0000-0000-0000-000000000010"), Method = PaymentMethodEnum.Bank,  Status = PaymentStatusEnum.Pending,  Amount = 175_000m, TransactionRef = "TXN-20260718-010", CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)  },
            new() { Id = new Guid("88000000-0000-0000-0000-000000000011"), OrderId = new Guid("77000000-0000-0000-0000-000000000011"), Method = PaymentMethodEnum.COD,   Status = PaymentStatusEnum.Pending,  Amount = 72_000m,  TransactionRef = "TXN-20260719-011", CreatedAt = DateTimeOffset.UtcNow              },
        };

        context.Payments.AddRange(payments);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // POINT TRANSACTIONS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedPointTransactionsAsync(ApplicationDbContext context)
    {
        if (await context.PointTransactions.AnyAsync()) return;

        var txns = new List<PointTransaction>
        {
            new() { Id = new Guid("99000000-0000-0000-0000-000000000001"), WalletId = new Guid("66000000-0000-0000-0000-000000000002"), OrderId = new Guid("77000000-0000-0000-0000-000000000001"), Amount = 25,  Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000001", CreatedAt = DateTimeOffset.UtcNow.AddDays(-90) },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000002"), WalletId = new Guid("66000000-0000-0000-0000-000000000002"), OrderId = new Guid("77000000-0000-0000-0000-000000000002"), Amount = 40,  Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000002", CreatedAt = DateTimeOffset.UtcNow.AddDays(-60) },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000003"), WalletId = new Guid("66000000-0000-0000-0000-000000000002"), OrderId = null,                                              Amount = 100, Type = PointTransactionTypeEnum.Redeem, Description = "Redeem 100 points for discount",  CreatedAt = DateTimeOffset.UtcNow.AddDays(-55) },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000004"), WalletId = new Guid("66000000-0000-0000-0000-000000000003"), OrderId = new Guid("77000000-0000-0000-0000-000000000003"), Amount = 15,  Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000003", CreatedAt = DateTimeOffset.UtcNow.AddDays(-80) },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000005"), WalletId = new Guid("66000000-0000-0000-0000-000000000004"), OrderId = new Guid("77000000-0000-0000-0000-000000000004"), Amount = 20,  Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000004", CreatedAt = DateTimeOffset.UtcNow.AddDays(-3)  },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000006"), WalletId = new Guid("66000000-0000-0000-0000-000000000005"), OrderId = new Guid("77000000-0000-0000-0000-000000000005"), Amount = 8,   Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000005", CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)  },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000007"), WalletId = new Guid("66000000-0000-0000-0000-000000000006"), OrderId = new Guid("77000000-0000-0000-0000-000000000006"), Amount = 60,  Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000006", CreatedAt = DateTimeOffset.UtcNow.AddDays(-45) },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000008"), WalletId = new Guid("66000000-0000-0000-0000-000000000006"), OrderId = null,                                              Amount = 200, Type = PointTransactionTypeEnum.Redeem, Description = "Redeem 200 points for discount",  CreatedAt = DateTimeOffset.UtcNow.AddDays(-44) },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000009"), WalletId = new Guid("66000000-0000-0000-0000-000000000007"), OrderId = new Guid("77000000-0000-0000-0000-000000000007"), Amount = 10,  Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000007", CreatedAt = DateTimeOffset.UtcNow.AddDays(-2)  },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000010"), WalletId = new Guid("66000000-0000-0000-0000-000000000009"), OrderId = new Guid("77000000-0000-0000-0000-000000000009"), Amount = 9,   Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000009", CreatedAt = DateTimeOffset.UtcNow.AddDays(-20) },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000011"), WalletId = new Guid("66000000-0000-0000-0000-000000000010"), OrderId = new Guid("77000000-0000-0000-0000-000000000010"), Amount = 11,  Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000010", CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)  },
            new() { Id = new Guid("99000000-0000-0000-0000-000000000012"), WalletId = new Guid("66000000-0000-0000-0000-000000000011"), OrderId = new Guid("77000000-0000-0000-0000-000000000011"), Amount = 5,   Type = PointTransactionTypeEnum.Earn,   Description = "Earn points for order #77000011", CreatedAt = DateTimeOffset.UtcNow              },
        };

        context.PointTransactions.AddRange(txns);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // CART ITEMS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedCartItemsAsync(ApplicationDbContext context)
    {
        if (await context.CartItems.AnyAsync()) return;

        var cartItems = new List<CartItem>
        {
            // User 4's cart
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000001"), CartId = new Guid("55000000-0000-0000-0000-000000000004"), ProductId = new Guid("33000000-0000-0000-0000-000000000001"), Quantity = 2 },
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000002"), CartId = new Guid("55000000-0000-0000-0000-000000000004"), ProductId = new Guid("33000000-0000-0000-0000-000000000006"), Quantity = 1 },
            // User 5's cart
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000003"), CartId = new Guid("55000000-0000-0000-0000-000000000005"), ProductId = new Guid("33000000-0000-0000-0000-000000000002"), Quantity = 1 },
            // User 6's cart
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000004"), CartId = new Guid("55000000-0000-0000-0000-000000000006"), ProductId = new Guid("33000000-0000-0000-0000-000000000013"), Quantity = 1 },
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000005"), CartId = new Guid("55000000-0000-0000-0000-000000000006"), ProductId = new Guid("33000000-0000-0000-0000-000000000012"), Quantity = 3 },
            // User 7's cart
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000006"), CartId = new Guid("55000000-0000-0000-0000-000000000007"), ProductId = new Guid("33000000-0000-0000-0000-000000000005"), Quantity = 2 },
            // User 8's cart
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000007"), CartId = new Guid("55000000-0000-0000-0000-000000000008"), ProductId = new Guid("33000000-0000-0000-0000-000000000008"), Quantity = 1 },
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000008"), CartId = new Guid("55000000-0000-0000-0000-000000000008"), ProductId = new Guid("33000000-0000-0000-0000-000000000009"), Quantity = 2 },
            // User 10's cart
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000009"), CartId = new Guid("55000000-0000-0000-0000-000000000010"), ProductId = new Guid("33000000-0000-0000-0000-000000000007"), Quantity = 4 },
            // User 11's cart
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000010"), CartId = new Guid("55000000-0000-0000-0000-000000000011"), ProductId = new Guid("33000000-0000-0000-0000-000000000003"), Quantity = 1 },
            new() { Id = new Guid("AA000000-0000-0000-0000-000000000011"), CartId = new Guid("55000000-0000-0000-0000-000000000011"), ProductId = new Guid("33000000-0000-0000-0000-000000000014"), Quantity = 1 },
        };

        context.CartItems.AddRange(cartItems);
        await context.SaveChangesAsync();
    }

    // ────────────────────────────────────────────────────────────────────
    // ORDER ITEMS
    // ────────────────────────────────────────────────────────────────────
    private static async Task SeedOrderItemsAsync(ApplicationDbContext context)
    {
        if (await context.OrderItems.AnyAsync()) return;

        var orderItems = new List<OrderItem>
        {
            // Order 1 (user 2)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000001"), OrderId = new Guid("77000000-0000-0000-0000-000000000001"), ProductId = new Guid("33000000-0000-0000-0000-000000000001"), Quantity = 1, UnitPrice = 89_000m,  UnitCo2Saved = 0.30m },
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000002"), OrderId = new Guid("77000000-0000-0000-0000-000000000001"), ProductId = new Guid("33000000-0000-0000-0000-000000000003"), Quantity = 2, UnitPrice = 75_000m,  UnitCo2Saved = 0.22m },
            // Order 2 (user 2)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000003"), OrderId = new Guid("77000000-0000-0000-0000-000000000002"), ProductId = new Guid("33000000-0000-0000-0000-000000000005"), Quantity = 1, UnitPrice = 110_000m, UnitCo2Saved = 0.74m },
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000004"), OrderId = new Guid("77000000-0000-0000-0000-000000000002"), ProductId = new Guid("33000000-0000-0000-0000-000000000007"), Quantity = 2, UnitPrice = 95_000m,  UnitCo2Saved = 0.43m },
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000005"), OrderId = new Guid("77000000-0000-0000-0000-000000000002"), ProductId = new Guid("33000000-0000-0000-0000-000000000012"), Quantity = 1, UnitPrice = 120_000m, UnitCo2Saved = 5.20m },
            // Order 3 (user 3)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000006"), OrderId = new Guid("77000000-0000-0000-0000-000000000003"), ProductId = new Guid("33000000-0000-0000-0000-000000000006"), Quantity = 1, UnitPrice = 165_000m, UnitCo2Saved = 0.80m },
            // Order 4 (user 4)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000007"), OrderId = new Guid("77000000-0000-0000-0000-000000000004"), ProductId = new Guid("33000000-0000-0000-0000-000000000008"), Quantity = 1, UnitPrice = 280_000m, UnitCo2Saved = 1.55m },
            // Order 5 (user 5)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000008"), OrderId = new Guid("77000000-0000-0000-0000-000000000005"), ProductId = new Guid("33000000-0000-0000-0000-000000000001"), Quantity = 1, UnitPrice = 89_000m,  UnitCo2Saved = 0.30m },
            // Order 6 (user 6)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000009"), OrderId = new Guid("77000000-0000-0000-0000-000000000006"), ProductId = new Guid("33000000-0000-0000-0000-000000000013"), Quantity = 1, UnitPrice = 850_000m, UnitCo2Saved = 5.20m },
            // Order 7 (user 7)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000010"), OrderId = new Guid("77000000-0000-0000-0000-000000000007"), ProductId = new Guid("33000000-0000-0000-0000-000000000005"), Quantity = 1, UnitPrice = 110_000m, UnitCo2Saved = 0.74m },
            // Order 8 (user 8) - cancelled
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000011"), OrderId = new Guid("77000000-0000-0000-0000-000000000008"), ProductId = new Guid("33000000-0000-0000-0000-000000000004"), Quantity = 1, UnitPrice = 145_000m, UnitCo2Saved = 0.32m },
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000012"), OrderId = new Guid("77000000-0000-0000-0000-000000000008"), ProductId = new Guid("33000000-0000-0000-0000-000000000009"), Quantity = 1, UnitPrice = 72_000m,  UnitCo2Saved = 0.51m },
            // Order 9 (user 9)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000013"), OrderId = new Guid("77000000-0000-0000-0000-000000000009"), ProductId = new Guid("33000000-0000-0000-0000-000000000010"), Quantity = 2, UnitPrice = 55_000m,  UnitCo2Saved = 0.27m },
            // Order 10 (user 10)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000014"), OrderId = new Guid("77000000-0000-0000-0000-000000000010"), ProductId = new Guid("33000000-0000-0000-0000-000000000011"), Quantity = 1, UnitPrice = 190_000m, UnitCo2Saved = 1.11m },
            // Order 11 (user 11)
            new() { Id = new Guid("BB000000-0000-0000-0000-000000000015"), OrderId = new Guid("77000000-0000-0000-0000-000000000011"), ProductId = new Guid("33000000-0000-0000-0000-000000000009"), Quantity = 1, UnitPrice = 72_000m,  UnitCo2Saved = 0.51m },
        };

        context.OrderItems.AddRange(orderItems);
        await context.SaveChangesAsync();
    }
}
