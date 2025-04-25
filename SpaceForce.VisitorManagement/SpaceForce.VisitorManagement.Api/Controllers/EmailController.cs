using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MimeKit;
using System.Net.Security;
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
                return Ok(new { success = true, message = "Confirmation email sent successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending confirmation email: {ex.Message}");
                return BadRequest(new { success = false, message = $"Failed to send email: {ex.Message}" });
            }
        }
        
        public void SendConfirmationEmail(string firstName, string lastName, string userEmail, DateTime time)
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
                throw; // Re-throw to be handled by the controller
            }
        }
        
        [HttpGet("SendNotification")]
        public IActionResult SendNotification([FromQuery]string message, [FromQuery]string userEmail)
        {
            try
            {
                SendNotificationEmail(message, userEmail);
                return Ok(new { success = true, message = "Notification email sent successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending notification email: {ex.Message}");
                return BadRequest(new { success = false, message = $"Failed to send notification: {ex.Message}" });
            }
        }
        
        public void SendNotificationEmail(string message, string userEmail)
        {
            try 
            {
                // Log the attempt
                Console.WriteLine($"Sending notification email to: {userEmail}");
                
                // Get email settings from configuration
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var port = int.Parse(emailSettings["Port"]);
                var username = emailSettings["Username"];
                var password = emailSettings["Password"];
                var senderEmail = emailSettings["SenderEmail"];
                var senderName = emailSettings["SenderName"];
                
                // Create a new message
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(senderName, senderEmail));
                email.To.Add(new MailboxAddress("Visitor", userEmail));
                email.Subject = "Space Force Visitor Portal Notification";
                
                // Create message body
                var bodyBuilder = new BodyBuilder();
                bodyBuilder.HtmlBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <div style='background-color: #1E3A8A; color: white; padding: 20px; text-align: center;'>
                        <h1>Space Force Visitor Portal</h1>
                    </div>
                    <div style='padding: 20px;'>
                        <h2>Important Notification</h2>
                        <p>{message}</p>
                        <p>Thank you,<br>Space Force Visitor Management Team</p>
                    </div>
                </body>
                </html>";
                
                email.Body = bodyBuilder.ToMessageBody();
                
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
                    client.Send(email);
                    
                    // Disconnect from the server
                    client.Disconnect(true);
                }
                
                Console.WriteLine($"Notification email sent successfully to: {userEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending notification: {ex.Message}");
                throw; // Re-throw to be handled by the controller
            }
        }
    }
}
