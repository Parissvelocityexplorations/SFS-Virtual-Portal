using SpaceForce.VisitorManagement.Data.DbContexts;
using SpaceForce.VisitorManagement.Data.Models;
using SpaceForce.VisitorManagement.Data.Models.Enumerations;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceForce.VisitorManagement.Data.Seeds
{
    public static class SampleDataSeeder
    {
        public static async Task SeedSampleDataAsync(SfDbContext dbContext)
        {
            // Check if we already have data
            if (dbContext.Users.Any() || dbContext.Appointments.Any())
            {
                // Data exists - don't create duplicates
                return;
            }

            // Create sample users
            var users = new[]
            {
                new SfUser
                {
                    Id = Guid.NewGuid(),
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@example.com",
                    PhoneNo = "555-123-4567",
                    DateCreated = DateTime.UtcNow
                },
                new SfUser
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    PhoneNo = "555-987-6543",
                    DateCreated = DateTime.UtcNow
                },
                new SfUser
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Robert",
                    LastName = "Johnson",
                    Email = "robert.j@example.com",
                    PhoneNo = "555-456-7890",
                    DateCreated = DateTime.UtcNow
                },
                new SfUser
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Michael",
                    LastName = "Williams",
                    Email = "michael.w@example.com",
                    PhoneNo = "555-222-3333",
                    DateCreated = DateTime.UtcNow
                },
                new SfUser
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Sarah",
                    LastName = "Davis",
                    Email = "sarah.d@example.com",
                    PhoneNo = "555-444-5555",
                    DateCreated = DateTime.UtcNow
                }
            };

            await dbContext.Users.AddRangeAsync(users);
            await dbContext.SaveChangesAsync();

            // Get today's date at midnight
            var today = DateTime.UtcNow.Date;

            // Create sample appointments with different statuses and pass types
            var appointments = new[]
            {
                new SfAppointment
                {
                    Id = Guid.NewGuid(),
                    UserId = users[0].Id,
                    Date = today.AddHours(9), // 9 AM
                    Status = SfStatus.Scheduled,
                    PassType = SfPassType.VisitorPass,
                    DateCreated = DateTime.UtcNow
                },
                new SfAppointment
                {
                    Id = Guid.NewGuid(),
                    UserId = users[1].Id,
                    Date = today.AddHours(10), // 10 AM
                    Status = SfStatus.CheckedIn,
                    PassType = SfPassType.GolfPass,
                    DateCreated = DateTime.UtcNow
                },
                new SfAppointment
                {
                    Id = Guid.NewGuid(),
                    UserId = users[2].Id,
                    Date = today.AddHours(11), // 11 AM
                    Status = SfStatus.Serving,
                    PassType = SfPassType.VetCard,
                    DateCreated = DateTime.UtcNow
                },
                new SfAppointment
                {
                    Id = Guid.NewGuid(),
                    UserId = users[3].Id,
                    Date = today.AddHours(13), // 1 PM
                    Status = SfStatus.CheckedIn,
                    PassType = SfPassType.VisitorPass,
                    DateCreated = DateTime.UtcNow
                },
                new SfAppointment
                {
                    Id = Guid.NewGuid(),
                    UserId = users[4].Id,
                    Date = today.AddHours(14), // 2 PM
                    Status = SfStatus.Scheduled,
                    PassType = SfPassType.Contractor,
                    DateCreated = DateTime.UtcNow
                }
            };

            await dbContext.Appointments.AddRangeAsync(appointments);
            await dbContext.SaveChangesAsync();
        }
    }
}