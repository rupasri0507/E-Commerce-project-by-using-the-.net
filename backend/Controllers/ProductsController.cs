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
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(AppDbContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all products from the catalog with optional search filtering.
        /// </summary>
        /// <param name="search">Optional name or description keyword</param>
        /// <returns>List of products</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ProductResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts([FromQuery] string? search)
        {
            try
            {
                var query = _context.Products.AsNoTracking().AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    var keyword = search.Trim().ToLower();
                    query = query.Where(p => p.Name.ToLower().Contains(keyword) || 
                                             p.Description.ToLower().Contains(keyword));
                }

                var products = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new ProductResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        ImageUrl = p.ImageUrl,
                        StockQuantity = p.StockQuantity,
                        CreatedAt = p.CreatedAt
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching products." });
            }
        }

        /// <summary>
        /// Retrieves a specific product by its unique identifier.
        /// </summary>
        /// <param name="id">Product ID</param>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} was not found." });
                }

                var response = new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                    StockQuantity = product.StockQuantity,
                    CreatedAt = product.CreatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching the product." });
            }
        }

        /// <summary>
        /// Creates a new product in the store catalog.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ProductResponseDto>> CreateProduct([FromBody] ProductCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var product = new Product
                {
                    Name = dto.Name.Trim(),
                    Description = dto.Description.Trim(),
                    Price = dto.Price,
                    ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) 
                        ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" 
                        : dto.ImageUrl.Trim(),
                    StockQuantity = dto.StockQuantity,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var response = new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                    StockQuantity = product.StockQuantity,
                    CreatedAt = product.CreatedAt
                };

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new product");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the product." });
            }
        }

        /// <summary>
        /// Updates an existing product.
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ProductResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductResponseDto>> UpdateProduct(int id, [FromBody] ProductUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} was not found." });
                }

                product.Name = dto.Name.Trim();
                product.Description = dto.Description.Trim();
                product.Price = dto.Price;
                if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
                {
                    product.ImageUrl = dto.ImageUrl.Trim();
                }
                product.StockQuantity = dto.StockQuantity;

                await _context.SaveChangesAsync();

                var response = new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                    StockQuantity = product.StockQuantity,
                    CreatedAt = product.CreatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the product." });
            }
        }

        /// <summary>
        /// Deletes a product from the catalog.
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} was not found." });
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Product '{product.Name}' deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the product." });
            }
        }
    }
}
