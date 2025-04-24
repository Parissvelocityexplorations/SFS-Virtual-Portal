using Microsoft.AspNetCore.Mvc;

using MailKit.Net.Smtp;
using MimeKit;
namespace SpaceForce.VisitorManagement.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailController : ControllerBase
    {
        [HttpGet("SendConfirmation")]
        public static void SendConfirmation(string firstName, string lastName, string userEmail, DateTime time)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress("SFS Scheduling", "sfs.visitor.scheduling@gmail.com"));
            email.To.Add(new MailboxAddress(firstName + lastName, userEmail));

            email.Subject = "SFS Appointment Confirmation";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = "<h2>Thank you for using SFS Scheduler!  Here are your appointment details:</h2>\n" +
                // $"<p>Visitor Name: <b>{firstName} {lastName}</b></p>\n" +
                $"<p>Appointment Time: <b>{time.ToString("dddd, dd MMMM yyyy")}</b></p>\n"
            };
            using (var smtp = new SmtpClient())
            {
                smtp.Connect("smtp.gmail.com", 587, false);

                // Note: only needed if the SMTP server requires authentication
                smtp.Authenticate("sfs.visitor.scheduling@gmail.com", "mixe tilx wnpp klzm");

                smtp.Send(email);
                smtp.Disconnect(true);
            }
            return;
        }
        [HttpGet("SendNotification")]
        public static void SendNotification(string message, string userEmail)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress("SFS Scheduling", "sfs.visitor.scheduling@gmail.com"));
            email.To.Add(new MailboxAddress(userEmail, userEmail));

            email.Subject = "SFS Appointment Notification";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = $"{message}"
            };
            using (var smtp = new SmtpClient())
            {
                smtp.Connect("smtp.gmail.com", 587, false);

                // Note: only needed if the SMTP server requires authentication
                smtp.Authenticate("sfs.visitor.scheduling@gmail.com", "mixe tilx wnpp klzm");

                smtp.Send(email);
                smtp.Disconnect(true);
            }
            return;
        }
    }
}
