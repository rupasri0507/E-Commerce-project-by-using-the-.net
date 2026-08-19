using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// Represents a customer purchase order.
    /// </summary>
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        // Navigation property to the customer who placed the order
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // e.g., Pending, Processing, Completed, Cancelled

        // Line items included in this order
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
