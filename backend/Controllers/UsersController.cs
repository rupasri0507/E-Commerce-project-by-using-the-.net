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
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(AppDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Registers a new customer user account with password hashing.
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserResponseDto>> Register([FromBody] UserRegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

                // Check if user already exists
                var existingUser = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
                if (existingUser)
                {
                    return BadRequest(new { message = "An account with this email address already exists." });
                }

                // Hash password securely with BCrypt
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                var user = new User
                {
                    FullName = dto.FullName.Trim(),
                    Email = normalizedEmail,
                    PasswordHash = passwordHash,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var response = new UserResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    Message = "User registered successfully."
                };

                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the account." });
            }
        }

        /// <summary>
        /// Authenticates a user with email and password.
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserResponseDto>> Login([FromBody] UserLoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

                if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                {
                    return Unauthorized(new { message = "Invalid email or password." });
                }

                var response = new UserResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    Message = "Login successful."
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred during authentication." });
            }
        }

        /// <summary>
        /// Retrieves a user profile by ID.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { message = $"User with ID {id} was not found." });
                }

                var response = new UserResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    Message = "User found."
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching user profile." });
            }
        }
    }
}
