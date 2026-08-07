var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
        .WithDataVolume(isReadOnly: false)
        .WithPgAdmin()
        .WithImage("pgvector/pgvector", "pg18");

var db = postgres.AddDatabase("GreenEcoCommerce-DB", "green_eco_commerce");

var cache = builder.AddRedis("cache")
        .WithRedisInsight();

builder.AddProject<Projects.GreenEcoCommerce_WebAPI>("greenecocommerce-webapi")
        .WithReference(db)
        .WithReference(cache)
        .WaitFor(db);

builder.Build().Run();
