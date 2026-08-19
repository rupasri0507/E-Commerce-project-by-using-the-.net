using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Services & Dependency Injection
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 2. Configure Database Context (Entity Framework Core)
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
var sqlServerConnection = builder.Configuration.GetConnectionString("DefaultConnection");
var sqliteConnection = builder.Configuration.GetConnectionString("SqliteConnection") ?? "Data Source=ecommerce.db";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlServer(sqlServerConnection, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        });
    }
    else
    {
        options.UseSqlite(sqliteConnection);
    }
});

// 3. Configure CORS for Frontend React Client
var corsOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>() ?? new[]
{
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 4. Configure Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "DevStore E-Commerce API",
        Version = "v1",
        Description = "RESTful ASP.NET Core Web API for E-Commerce web application with SQL Server, EF Core, and React frontend."
    });
});

var app = builder.Build();

// 5. Database Initialization & Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        logger.LogInformation("Ensuring database is created and seeding initial data...");
        await DbInitializer.InitializeAsync(context);
        logger.LogInformation("Database initialized and seeded successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error initializing database.");
    }
}

// 6. Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DevStore E-Commerce API v1");
        c.RoutePrefix = "swagger";
    });
}

// Enable CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new 
{ 
    status = "Healthy", 
    timestamp = DateTime.UtcNow, 
    framework = ".NET 8 ASP.NET Core Web API" 
}));

app.Run();
