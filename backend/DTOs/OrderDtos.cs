using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CreateOrderItemDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A valid ProductId is required")]
        public int ProductId { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "Quantity must be at least 1 and at most 100")]
        public int Quantity { get; set; }
    }

    public class CreateOrderDto
    {
        [Required(ErrorMessage = "UserId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "A valid UserId is required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Order must contain at least one item")]
        [MinLength(1, ErrorMessage = "Order must contain at least one item")]
        public List<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
    }

    public class OrderItemResponseDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductImageUrl { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal => Quantity * UnitPrice;
    }

    public class OrderResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<OrderItemResponseDto> Items { get; set; } = new List<OrderItemResponseDto>();
    }
}
