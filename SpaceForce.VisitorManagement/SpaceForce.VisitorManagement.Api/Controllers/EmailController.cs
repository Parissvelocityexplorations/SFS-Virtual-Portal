using Microsoft.AspNetCore.Mvc;
using System;

using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
namespace SpaceForce.VisitorManagement.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailController : Controller
    {
        [HttpGet(Name = "GetTest")]
        public String Get()
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress("Ginny1", "ginnyglink@gmail.com"));
            email.To.Add(new MailboxAddress("Ginny2", "ginnyglink@gmail.com"));

            email.Subject = "Testing out email sending";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = "<b>Hello all the way from the land of C#</b>"
            };

            using (var smtp = new SmtpClient())
            {
                smtp.Connect("smtp.gmail.com", 587, false);

                // Note: only needed if the SMTP server requires authentication
                smtp.Authenticate("ginnyglink@gmail.com", "rpsy oxnf tdsk pdau");

                smtp.Send(email);
                smtp.Disconnect(true);
            }
            return "test";
        }
    }
}
