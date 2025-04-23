using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceForce.VisitorManagement.Data.DbContexts;
using SpaceForce.VisitorManagement.Data.Models;
using SpaceForce.VisitorManagement.Data.Models.Enumerations;

namespace SpaceForce.VisitorManagement.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly SfDbContext _dbContext;

    public AppointmentsController(SfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("userId/${userId}")]
    public async Task<IActionResult> GetAsync(Guid userId)
    {
        try
        {
            List<SfAppointment> appts = await _dbContext.Appointments.Where(x => x.UserId == userId).ToListAsync();
            return Ok(appts);
        }
        catch (Exception e)
        {
            return BadRequest($"Unable to retrieve appointments for user {userId}.  Details: {e.Message}");
        }
    }
    
    [HttpPost("userid/{userId}/date/{date}")]
    public async Task<IActionResult> AddAsync(Guid userId, DateTime date)
    {
        try
        {
            //Determine if user has any open appointments
            SfAppointment? appt = await _dbContext.Appointments.FirstOrDefaultAsync(x => x.UserId == userId && x.Status > SfStatus.Served);
            if (appt != null)
            {
                return BadRequest("An existing appointment exists.  Only one open appointment is allowed at any given time.");
            }

            appt = new SfAppointment()
            {
                UserId = userId,
                Date = date
            };
            await _dbContext.AddAsync(appt);
            await _dbContext.SaveChangesAsync();
            return Ok(appt);
        }
        catch (Exception e)
        {
            return BadRequest($"Error creating an appointment.  Details:  {e.Message}");
        }
    }
    
    [HttpPut("{appointmentId}/status/{status}")]
    public async Task<IActionResult> UpdateStatusAsync(Guid appointmentId, SfStatus status)
    {
        try
        {
            //Get the appointment
            SfAppointment? appt = await _dbContext.Appointments.FirstOrDefaultAsync(x => x.Id == appointmentId);
            if (appt == null)
            {
                throw new Exception($"Unable to find an appointment with the ID {appointmentId}");
            }

            if (status == SfStatus.NotSet)
            {
                return BadRequest("Invalid status.  Cannot update the status to NotSet");
            }

            switch (appt.Status)
            {
                case SfStatus.Scheduled when status != SfStatus.CheckedIn && status != SfStatus.Cancelled:
                    return BadRequest("Invalid status.  The status can only be updated to CheckedIn or Cancelled");
                case SfStatus.CheckedIn when status != SfStatus.Serving && status != SfStatus.Cancelled:
                    return BadRequest("Invalid status.  The status can only be updated to Serving or Cancelled.");
                case SfStatus.Serving when status != SfStatus.Served && status != SfStatus.Cancelled:
                    return BadRequest("Invalid status.  The status can only be updated to Served or Cancelled");
                case SfStatus.Served:
                case SfStatus.Cancelled:
                    return BadRequest("Invalid status.  This appointment is complete.");
            }

            appt.Status = status;
            _dbContext.Appointments.Update(appt);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest($"Unable to update the appointment status.  Details:  {e.Message}");
        }
    }
}