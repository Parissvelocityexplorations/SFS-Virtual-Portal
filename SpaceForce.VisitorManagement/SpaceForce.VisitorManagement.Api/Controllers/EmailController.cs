using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MimeKit;
namespace SpaceForce.VisitorManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : Controller
    {
        private readonly IConfiguration _configuration;

        public EmailController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("SendConfirmation")]
        public IActionResult SendConfirmation([FromQuery]string firstName, [FromQuery]string lastName, [FromQuery]string userEmail, [FromQuery]string time)
        {
            try
            {
                DateTime parsedTime;
                if (!DateTime.TryParse(time, out parsedTime))
                {
                    return BadRequest(new { success = false, message = $"Failed to parse time parameter: {time}" });
                }
                
                SendConfirmationEmail(firstName, lastName, userEmail, parsedTime);
                return Ok(new { success = true, message = "Confirmation email simulation completed successfully" });
            }
            catch (Exception ex)
            {
                // Should never happen now that we're simulating
                return BadRequest(new { success = false, message = $"Failed to simulate email: {ex.Message}" });
            }
        }
        
        public void SendConfirmationEmail(string firstName, string lastName, string userEmail, DateTime time)
        {
            try 
            {
                // Just log a confirmation for now but don't actually attempt to send email
                // This way the app will continue to function without errors
                Console.WriteLine($"[SIMULATED EMAIL] Would have sent confirmation to: {userEmail}");
                Console.WriteLine($"[SIMULATED EMAIL] Visitor: {firstName} {lastName}");
                Console.WriteLine($"[SIMULATED EMAIL] Appointment: {time.ToString("dddd, dd MMMM yyyy")}");
                
                // Create a success message with QR code URL
                string qrUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SFVP-{firstName}-{lastName}-{time.ToString("yyyyMMdd")}";
                Console.WriteLine($"[SIMULATED EMAIL] QR Code URL: {qrUrl}");
                
                // Success!
                Console.WriteLine($"Email simulation successful for: {userEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in email simulation: {ex.Message}");
                // We're simulating, so don't throw errors
            }
        }
        
        [HttpGet("SendNotification")]
        public IActionResult SendNotification([FromQuery]string message, [FromQuery]string userEmail)
        {
            try
            {
                SendNotificationEmail(message, userEmail);
                return Ok(new { success = true, message = "Notification email simulation completed successfully" });
            }
            catch (Exception ex)
            {
                // Should never happen now that we're simulating
                return BadRequest(new { success = false, message = $"Failed to simulate notification: {ex.Message}" });
            }
        }
        
        public void SendNotificationEmail(string message, string userEmail)
        {
            try 
            {
                // Just log a notification for now but don't actually attempt to send email
                Console.WriteLine($"[SIMULATED NOTIFICATION] Would have sent to: {userEmail}");
                Console.WriteLine($"[SIMULATED NOTIFICATION] Message: {message}");
                
                // Success!
                Console.WriteLine($"Notification simulation successful for: {userEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in notification simulation: {ex.Message}");
                // We're simulating, so don't throw errors
            }
        }
    }
}
