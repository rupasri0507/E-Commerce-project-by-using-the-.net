using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Creates a new customer order, validates stock, calculates totals server-side, and deducts inventory.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(OrderResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.Items == null || dto.Items.Count == 0)
            {
                return BadRequest(new { message = "An order must contain at least one item." });
            }

            try
            {
                // Verify user exists
                var user = await _context.Users.FindAsync(dto.UserId);
                if (user == null)
                {
                    return NotFound(new { message = $"User with ID {dto.UserId} not found." });
                }

                // Collect requested product IDs
                var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
                var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

                if (products.Count != productIds.Count)
                {
                    return BadRequest(new { message = "One or more products in your order do not exist." });
                }

                // Check stock and calculate total
                decimal totalAmount = 0m;
                var order = new Order
                {
                    UserId = dto.UserId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Completed",
                    TotalAmount = 0m,
                    OrderItems = new List<OrderItem>()
                };

                foreach (var itemDto in dto.Items)
                {
                    var product = products.First(p => p.Id == itemDto.ProductId);

                    if (product.StockQuantity < itemDto.Quantity)
                    {
                        return BadRequest(new { 
                            message = $"Insufficient stock for '{product.Name}'. Available: {product.StockQuantity}, Requested: {itemDto.Quantity}" 
                        });
                    }

                    // Deduct stock
                    product.StockQuantity -= itemDto.Quantity;

                    var itemTotal = product.Price * itemDto.Quantity;
                    totalAmount += itemTotal;

                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = itemDto.Quantity,
                        UnitPrice = product.Price
                    });
                }

                order.TotalAmount = totalAmount;

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Build response
                var response = new OrderResponseDto
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    CustomerName = user.FullName,
                    CustomerEmail = user.Email,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    Items = order.OrderItems.Select(oi =>
                    {
                        var product = products.First(p => p.Id == oi.ProductId);
                        return new OrderItemResponseDto
                        {
                            Id = oi.Id,
                            ProductId = oi.ProductId,
                            ProductName = product.Name,
                            ProductImageUrl = product.ImageUrl,
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice
                        };
                    }).ToList()
                };

                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order for user {UserId}", dto.UserId);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating your order." });
            }
        }

        /// <summary>
        /// Retrieves all orders placed by a specific user.
        /// </summary>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<OrderResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrdersByUserId(int userId)
        {
            try
            {
                var orders = await _context.Orders
                    .AsNoTracking()
                    .Where(o => o.UserId == userId)
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new OrderResponseDto
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        CustomerName = o.User != null ? o.User.FullName : "Customer",
                        CustomerEmail = o.User != null ? o.User.Email : "",
                        OrderDate = o.OrderDate,
                        TotalAmount = o.TotalAmount,
                        Status = o.Status,
                        Items = o.OrderItems.Select(oi => new OrderItemResponseDto
                        {
                            Id = oi.Id,
                            ProductId = oi.ProductId,
                            ProductName = oi.Product != null ? oi.Product.Name : "Product",
                            ProductImageUrl = oi.Product != null ? oi.Product.ImageUrl : "",
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders for user {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching user orders." });
            }
        }

        /// <summary>
        /// Retrieves an order by its ID with all line items and customer information.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrderResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderResponseDto>> GetOrderById(int id)
        {
            try
            {
                var order = await _context.Orders
                    .AsNoTracking()
                    .Where(o => o.Id == id)
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync();

                if (order == null)
                {
                    return NotFound(new { message = $"Order with ID {id} not found." });
                }

                var response = new OrderResponseDto
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    CustomerName = order.User != null ? order.User.FullName : "Customer",
                    CustomerEmail = order.User != null ? order.User.Email : "",
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    Items = order.OrderItems.Select(oi => new OrderItemResponseDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductName = oi.Product != null ? oi.Product.Name : "Product",
                        ProductImageUrl = oi.Product != null ? oi.Product.ImageUrl : "",
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching the order." });
            }
        }
    }
}
