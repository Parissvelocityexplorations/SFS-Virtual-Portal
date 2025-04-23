using Microsoft.AspNetCore.Mvc;
using SpaceForce.VisitorManagement.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceForce.VisitorManagement.Data.DbContexts;
using SpaceForce.VisitorManagement.Data.Models;

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

        [HttpGet("CreateUser")]
        public IActionResult CreateUser(string firstName, string lastName, string email, string phoneNo)
        {
            try
            {
                var testUser = new SfUser
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    PhoneNo = phoneNo
                };

                _dbContext.Users.Add(testUser);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e);
            }
        }
        [HttpGet("GetUsers")]
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
        [HttpGet("UpdateUser")]
        public async Task<IActionResult> UpdateUserAsync(string id, string firstName, string lastName, string email, string phoneNo)
        {
            try
            {
                SfUser testUser = await _dbContext.Users.Where(x => x.Id.ToString() == id).SingleOrDefaultAsync();

                if (testUser == null)
                {
                    Console.WriteLine("User with given Id not found");
                    return BadRequest();
                }

                testUser.FirstName = firstName;
                testUser.LastName = lastName;
                testUser.Email = email;
                testUser.PhoneNo = phoneNo;

                _dbContext.Users.Update(testUser);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e);
            }
        }

        [HttpGet("DeleteUser")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                SfUser testUser = await _dbContext.Users.Where(x => x.Id.ToString() == id).SingleOrDefaultAsync();

                if (testUser == null)
                {
                    Console.WriteLine("User with given Id not found");
                    return BadRequest();
                }
                
                _dbContext.Users.Remove(testUser);
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
