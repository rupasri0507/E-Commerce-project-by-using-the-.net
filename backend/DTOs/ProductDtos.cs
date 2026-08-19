using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 150 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, 100000.00, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Url(ErrorMessage = "Please provide a valid image URL")]
        public string ImageUrl { get; set; } = string.Empty;

        [Range(0, 100000, ErrorMessage = "Stock quantity cannot be negative")]
        public int StockQuantity { get; set; }
    }

    public class ProductUpdateDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(150, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, 100000.00)]
        public decimal Price { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        [Range(0, 100000)]
        public int StockQuantity { get; set; }
    }

    public class ProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
