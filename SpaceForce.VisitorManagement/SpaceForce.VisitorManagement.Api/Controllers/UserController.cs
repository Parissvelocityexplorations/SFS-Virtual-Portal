using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceForce.VisitorManagement.Data.DbContexts;
using SpaceForce.VisitorManagement.Data.Models;
using SpaceForce.VisitorManagement.Data.DTOs;

namespace SpaceForce.VisitorManagement.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private SfDbContext _dbContext;

        public UserController(SfDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public IActionResult CreateUser(SfUserDto testUser)
        {
            try
            {
                // Check if user with this email already exists
                var existingUser = _dbContext.Users.FirstOrDefault(u => u.Email == testUser.Email);
                
                if (existingUser != null)
                {
                    // Update existing user information
                    existingUser.FirstName = testUser.FirstName;
                    existingUser.LastName = testUser.LastName;
                    existingUser.PhoneNo = testUser.PhoneNo;
                    
                    _dbContext.Users.Update(existingUser);
                    _dbContext.SaveChanges();
                    
                    return Ok(existingUser); // Return the existing user with ID
                }
                else
                {
                    // Create a new user
                    var user = new SfUser
                    {
                        FirstName = testUser.FirstName,
                        LastName = testUser.LastName,
                        Email = testUser.Email,
                        PhoneNo = testUser.PhoneNo
                    };

                    _dbContext.Users.Add(user);
                    _dbContext.SaveChanges();
                    
                    return Ok(user); // Return the newly created user with ID
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                List<SfUser> users = await _dbContext.Users.ToListAsync();
                return Ok(users);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e);
            }
        }
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            try
            {
                SfUser user = await _dbContext.Users.Where(x => x.Id == userId).SingleOrDefaultAsync();
                return Ok(user);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e);
            }
        }
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserAsync(Guid userId, SfUserDto testUser)
        {
            try
            {
                SfUser user = await _dbContext.Users.Where(x => x.Id == userId).SingleOrDefaultAsync();

                if (testUser == null)
                {
                    Console.WriteLine("User with given Id not found");
                    return BadRequest();
                }

                user.FirstName = testUser.FirstName;
                user.LastName = testUser.LastName;
                user.Email = testUser.Email;
                user.PhoneNo = testUser.PhoneNo;

                _dbContext.Users.Update(user);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e);
            }
        }
    }
}
