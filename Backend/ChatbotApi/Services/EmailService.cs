using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System;
using ChatbotApi.Models;

namespace ChatbotApi.Services
{
    public interface IEmailService
    {
        Task SendContactEmailAsync(ContactRequest contactRequest);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendContactEmailAsync(ContactRequest contactRequest)
        {
            try
            {
                var message = new MimeMessage();
                
                // From address
                message.From.Add(new MailboxAddress("Chatbot Website Contact Form", "noreply@chatbotwebsite.com"));
                
                // To address - using the specified email
                message.To.Add(new MailboxAddress("Site Owner", "je7erickson@gmail.com"));
                
                // Subject
                message.Subject = $"New Contact Form Submission from {contactRequest.Name}";
                
                // Body
                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> {contactRequest.Name}</p>
                        <p><strong>Email:</strong> {contactRequest.Email}</p>
                        <p><strong>Company:</strong> {contactRequest.Company ?? "Not provided"}</p>
                        <p><strong>Message:</strong></p>
                        <p>{contactRequest.Message}</p>
                    "
                };
                
                message.Body = bodyBuilder.ToMessageBody();

                // Get SMTP settings from configuration
                string smtpServer = _configuration["Email:SmtpServer"] ?? "smtp.gmail.com";
                int smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                string smtpUsername = _configuration["Email:SmtpUsername"] ?? "";
                string smtpPassword = _configuration["Email:SmtpPassword"] ?? "";
                bool useSsl = bool.Parse(_configuration["Email:UseSsl"] ?? "true");

                // Send email
                using var client = new SmtpClient();
                
                await client.ConnectAsync(smtpServer, smtpPort, useSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);
                
                if (!string.IsNullOrEmpty(smtpUsername) && !string.IsNullOrEmpty(smtpPassword))
                {
                    await client.AuthenticateAsync(smtpUsername, smtpPassword);
                }
                
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                
                _logger.LogInformation($"Contact email sent successfully for {contactRequest.Email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending contact email for {contactRequest.Email}");
                throw;
            }
        }
    }
} 