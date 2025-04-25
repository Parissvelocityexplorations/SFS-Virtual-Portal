using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SpaceForce.VisitorManagement.Data.DbContexts;
using SpaceForce.VisitorManagement.Data.DTOs;
using SpaceForce.VisitorManagement.Data.Models;
using SpaceForce.VisitorManagement.Data.Models.Enumerations;
using MailKit.Net.Smtp;
using MimeKit;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly SfDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AppointmentsController(SfDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    [HttpGet("filter/startDate/{startDate}/endDate/{endDate}")]
    public async Task<IActionResult> GetByFilterAsync(DateTime startDate, DateTime? endDate, [FromQuery]List<SfStatus> statuses)
    {
        List<SfAppointment> appts = await _dbContext.Appointments
            .Where(x => x.Date >= startDate && x.Date <= endDate)
            .Where(y => statuses.Contains(y.Status))
            .ToListAsync();
        return Ok(appts);
    }
    
    [HttpGet("filter")]
    public async Task<IActionResult> GetByQueryFilterAsync(
        [FromQuery] string startDate, 
        [FromQuery] string? endDate = null, 
        [FromQuery] List<int>? statuses = null)
    {
        try
        {
            Console.WriteLine($"Raw params - startDate: {startDate}, endDate: {endDate}, statuses: {string.Join(",", statuses ?? new List<int>())}");

            // Parse date strings to DateTime - try multiple formats
            DateTime startDateTime;
            if (!DateTime.TryParse(startDate, out startDateTime))
            {
                // Try parsing with specific format
                if (!DateTime.TryParseExact(startDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out startDateTime))
                {
                    return BadRequest(new { error = $"Invalid start date format: {startDate}" });
                }
            }
            
            // Always ensure startDateTime is UTC
            startDateTime = DateTime.SpecifyKind(startDateTime.Date, DateTimeKind.Utc);
            
            DateTime endDateTime;
            if (string.IsNullOrEmpty(endDate))
            {
                // Default to end of start date if no end date provided
                endDateTime = DateTime.SpecifyKind(startDateTime.AddDays(1).AddTicks(-1), DateTimeKind.Utc);
                Console.WriteLine($"Using default end date: {endDateTime}");
            }
            else if (!DateTime.TryParse(endDate, out endDateTime))
            {
                // Try parsing with specific format
                if (!DateTime.TryParseExact(endDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out endDateTime))
                {
                    return BadRequest(new { error = $"Invalid end date format: {endDate}" });
                }
            }
            
            // Ensure end date covers the full day and is UTC
            endDateTime = DateTime.SpecifyKind(endDateTime.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);
            
            // For debugging
            Console.WriteLine($"Parsed dates: Start={startDateTime}, End={endDateTime}");
            
            // Create hardcoded list to match the enum values safely
            var validStatusValues = new List<SfStatus>();
            
            // If statuses is null or empty, set default values
            if (statuses == null || !statuses.Any())
            {
                validStatusValues.Add(SfStatus.Scheduled);
                validStatusValues.Add(SfStatus.CheckedIn);
                validStatusValues.Add(SfStatus.Serving);
                Console.WriteLine("No statuses provided, using defaults: Scheduled, CheckedIn, Serving");
            }
            else
            {
                foreach (var status in statuses)
                {
                    switch (status)
                    {
                        case 0:
                            validStatusValues.Add(SfStatus.Scheduled);
                            break;
                        case 1:
                            validStatusValues.Add(SfStatus.CheckedIn);
                            break;
                        case 2:
                            validStatusValues.Add(SfStatus.Serving);
                            break;
                        case 3:
                            validStatusValues.Add(SfStatus.Served);
                            break;
                        case 4:
                            validStatusValues.Add(SfStatus.Cancelled);
                            break;
                        default:
                            Console.WriteLine($"Warning: Invalid status value {status}");
                            break;
                    }
                }
                
                // If no valid statuses after parsing, use default values
                if (validStatusValues.Count == 0)
                {
                    validStatusValues.Add(SfStatus.Scheduled);
                    validStatusValues.Add(SfStatus.CheckedIn);
                    validStatusValues.Add(SfStatus.Serving);
                    Console.WriteLine("No valid status values provided, using defaults: Scheduled, CheckedIn, Serving");
                }
            }
            
            Console.WriteLine($"Valid status values: {string.Join(", ", validStatusValues)}");
            
            // Use simple query construction
            var appointments = await _dbContext.Appointments
                .Include(x => x.User)
                .Where(a => a.Date >= startDateTime.Date && a.Date <= endDateTime)
                .Where(a => validStatusValues.Contains(a.Status))
                .ToListAsync();
            
            Console.WriteLine($"Found {appointments.Count} appointments");
                
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetByQueryFilterAsync: {ex}");
            return StatusCode(500, new { error = $"Internal server error: {ex.Message}" });
        }
    }

    [HttpGet("userId/{userId}")]
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
    public async Task<IActionResult> AddAsync(Guid userId, DateTime date, SfUserDto user)
    {
        try
        {
            //Determine if user has any open appointments
            SfAppointment? appt = await _dbContext.Appointments.FirstOrDefaultAsync(x => x.UserId == userId && x.Status > SfStatus.Served);
            if (appt != null)
            {
                return BadRequest("An existing appointment exists.  Only one open appointment is allowed at any given time.");
            }

            // Determine pass type based on service information passed in user object
            // Default to Visitor Pass if not specified
            SfPassType passType = SfPassType.VisitorPass; // Default to Visitor Pass
            
            if (user.Service != null)
            {
                switch (user.Service.ToLower())
                {
                    case "golf":
                        passType = SfPassType.GolfPass;
                        break;
                    case "vhic":
                        passType = SfPassType.VetCard;
                        break;
                    case "dbids":
                        passType = SfPassType.Contractor;
                        break;
                    default:
                        passType = SfPassType.VisitorPass;
                        break;
                }
            }

            appt = new SfAppointment()
            {
                UserId = userId,
                Date = date,
                Status = SfStatus.Scheduled,
                PassType = passType
            };

            await _dbContext.AddAsync(appt);
            await _dbContext.SaveChangesAsync();

            // Send confirmation email asynchronously to avoid blocking the response
            _ = Task.Run(() => {
                try {
                    // Send email directly rather than using EmailController
                    SendConfirmationEmail(user.FirstName, user.LastName, user.Email, appt.Date);
                } catch (Exception emailEx) {
                    // Log error but don't fail the appointment creation
                    Console.WriteLine($"Error sending confirmation email: {emailEx.Message}");
                }
            });
            
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
    
    private void SendConfirmationEmail(string firstName, string lastName, string userEmail, DateTime time)
    {
        try 
        {
            // Log the attempt
            Console.WriteLine($"Sending confirmation email to: {userEmail}");
            
            // Get email settings from configuration
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"];
            var port = int.Parse(emailSettings["Port"]);
            var username = emailSettings["Username"];
            var password = emailSettings["Password"];
            var senderEmail = emailSettings["SenderEmail"];
            var senderName = emailSettings["SenderName"];
            
            // Create a new message
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress(firstName + " " + lastName, userEmail));
            message.Subject = "Your Space Force Visitor Portal Appointment Confirmation";
            
            // Create QR code URL for the appointment
            string qrUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SFVP-{firstName}-{lastName}-{time.ToString("yyyyMMdd")}";
            
            // Create message body with HTML
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
            <html>
            <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background-color: #1E3A8A; color: white; padding: 20px; text-align: center;'>
                    <h1>Space Force Visitor Portal</h1>
                </div>
                <div style='padding: 20px;'>
                    <h2>Appointment Confirmation</h2>
                    <p>Hello {firstName} {lastName},</p>
                    <p>Your appointment has been confirmed for:</p>
                    <p style='font-weight: bold; font-size: 18px;'>{time.ToString("dddd, MMMM dd, yyyy")}</p>
                    
                    <div style='background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                        <p>Please scan your QR code at the visitor kiosk upon arrival:</p>
                        <div style='text-align: center;'>
                            <img src='{qrUrl}' alt='QR Code' style='max-width: 150px;' />
                        </div>
                    </div>
                    
                    <p>Please arrive 15 minutes before your appointment with a valid ID.</p>
                    <p>Thank you,<br>Space Force Visitor Management Team</p>
                </div>
            </body>
            </html>";
            
            message.Body = bodyBuilder.ToMessageBody();
            
            // Send the email
            using (var client = new SmtpClient())
            {
                // Accept all SSL certificates (for testing only)
                client.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
                
                // Connect to SMTP server
                client.Connect(smtpServer, port, MailKit.Security.SecureSocketOptions.StartTls);
                
                // Authenticate with SMTP server
                client.Authenticate(username, password);
                
                // Send the message
                client.Send(message);
                
                // Disconnect from the server
                client.Disconnect(true);
            }
            
            Console.WriteLine($"Email sent successfully to: {userEmail}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
            // Log but don't throw - we don't want appointment creation to fail if email fails
        }
    }
}