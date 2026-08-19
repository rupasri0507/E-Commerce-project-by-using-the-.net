using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a customer/user in the e-commerce system.
    /// </summary>
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(120)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for user's past orders
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
