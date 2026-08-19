using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    /// <summary>
    /// Handles database initialization and initial mock/seed data insertion.
    /// </summary>
    public static class DbInitializer
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Seed Products if none exist
            if (!await context.Products.AnyAsync())
            {
                var products = new List<Product>
                {
                    new Product
                    {
                        Name = "Aura Sound Pro Wireless Headphones",
                        Description = "Flagship active noise-cancelling over-ear headphones engineered with custom 40mm drivers, spatial audio, and up to 40 hours of battery life on a single charge.",
                        Price = 249.99m,
                        ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 25,
                        CreatedAt = DateTime.UtcNow.AddDays(-10)
                    },
                    new Product
                    {
                        Name = "PulseTrack Ultra Smartwatch",
                        Description = "Next-generation health and fitness smartwatch featuring a brilliant 1.43-inch AMOLED display, aerospace-grade titanium bezel, ECG sensor, and 5ATM water resistance.",
                        Price = 199.99m,
                        ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 30,
                        CreatedAt = DateTime.UtcNow.AddDays(-9)
                    },
                    new Product
                    {
                        Name = "ErgoCraft Mechanical Keyboard",
                        Description = "Custom hot-swappable mechanical keyboard with factory-lubed tactile switches, sound-dampening foam, per-key RGB backlighting, and durable PBT keycaps.",
                        Price = 129.50m,
                        ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 18,
                        CreatedAt = DateTime.UtcNow.AddDays(-8)
                    },
                    new Product
                    {
                        Name = "Precision Master Pro Wireless Mouse",
                        Description = "Ergonomic high-performance wireless mouse with 8000 DPI Darkfield sensor, dual-mode MagSpeed scrolling wheel, and multi-device Bluetooth connectivity.",
                        Price = 89.99m,
                        ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 40,
                        CreatedAt = DateTime.UtcNow.AddDays(-7)
                    },
                    new Product
                    {
                        Name = "Lumix Studio Monitor Light Bar",
                        Description = "ScreenBar e-reading LED monitor desk lamp with auto-dimming ambient light sensor, adjustable color temperature (2700K-6500K), and zero screen glare.",
                        Price = 64.99m,
                        ImageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 50,
                        CreatedAt = DateTime.UtcNow.AddDays(-6)
                    },
                    new Product
                    {
                        Name = "OmniPower 100W GaN Fast Charger",
                        Description = "Ultra-compact 4-port Gallium Nitride (GaN) fast wall charger with 3x USB-C Power Delivery ports and 1x USB-A port for laptop, tablet, and smartphone charging.",
                        Price = 49.99m,
                        ImageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 65,
                        CreatedAt = DateTime.UtcNow.AddDays(-5)
                    },
                    new Product
                    {
                        Name = "Voyager Eco Commuter Backpack",
                        Description = "Minimalist, weather-resistant commuter backpack crafted from 100% recycled fabrics. Features a dedicated padded 16-inch laptop pocket and hidden passport sleeve.",
                        Price = 119.00m,
                        ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 22,
                        CreatedAt = DateTime.UtcNow.AddDays(-4)
                    },
                    new Product
                    {
                        Name = "StreamCam 4K Studio Webcam",
                        Description = "Broadcast-quality 4K 60fps streaming webcam equipped with HDR Sony sensor, intelligent autofocus, and dual stereo beamforming noise-cancelling microphones.",
                        Price = 159.99m,
                        ImageUrl = "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80",
                        StockQuantity = 15,
                        CreatedAt = DateTime.UtcNow.AddDays(-3)
                    }
                };

                await context.Products.AddRangeAsync(products);
                await context.SaveChangesAsync();
            }

            // Seed a demo user if none exists
            if (!await context.Users.AnyAsync())
            {
                var demoUser = new User
                {
                    FullName = "Alex Morgan",
                    Email = "alex.morgan@example.com",
                    // Hashed password for 'password123'
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                };

                await context.Users.AddAsync(demoUser);
                await context.SaveChangesAsync();
            }
        }
    }
}
