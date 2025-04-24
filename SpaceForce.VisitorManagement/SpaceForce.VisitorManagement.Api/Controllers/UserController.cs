using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceForce.VisitorManagement.Data.DbContexts;
using SpaceForce.VisitorManagement.Data.Models;
using SpaceForce.VisitorManagement.Data.DTOs;

namespace SpaceForce.VisitorManagement.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private SfDbContext _dbContext;

        public UserController(SfDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(SfUserDto data)
        {
            try
            {
                if (string.IsNullOrEmpty(data.Email))
                {
                    return BadRequest("Invalid email address.  Email address must be a non-empty value");
                }

                if (string.IsNullOrEmpty(data.FirstName))
                {
                    return BadRequest("Invalid first name.  First name must be a non-empty value.");
                }

                if (string.IsNullOrEmpty(data.LastName))
                {
                    return BadRequest("Invalid last name.  Last name must be a non-empty value.");
                }

                if (string.IsNullOrEmpty(data.PhoneNo))
                {
                    return BadRequest("Invalid phone number.  Phone number must be a non-empty value.");
                }

                SfUser? user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == data.Email.ToLower());
                if (user != null)
                {
                    return Ok(user);
                }

                user = new SfUser
                {
                    FirstName = data.FirstName,
                    LastName = data.LastName,
                    Email = data.Email,
                    PhoneNo = data.PhoneNo
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e);
            }
        }

        [HttpGet("/allUsers")]
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

        [HttpGet("userId/${userId}")]
        public async Task<IActionResult> GetUser(Guid userId)
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

        [HttpPut("userId/${userId}")]
        public async Task<IActionResult> UpdateUserAsync(Guid userId, SfUserDto testUser)
        {
            try
            {
                SfUser? user = await _dbContext.Users.Where(x => x.Id == userId).SingleOrDefaultAsync();

                if (user == null)
                {
                    Console.WriteLine("User with given Id not found");
                    return BadRequest();
                }

                user.FirstName = testUser.FirstName;
                user.LastName = testUser.LastName;
                user.Email = testUser.Email;
                user.PhoneNo = testUser.PhoneNo;

                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();
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