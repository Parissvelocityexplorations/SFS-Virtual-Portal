﻿using Microsoft.AspNetCore.Mvc;
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
                // CHANGED: Always create a new user record for each appointment
                // This ensures each appointment has its own user data that won't be affected by future appointments
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
