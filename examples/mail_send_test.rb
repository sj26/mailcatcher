# frozen_string_literal: true

require "net/smtp"

def send_email(sender_email, sender_password, recipient_email, subject, body)
  smtp_server = "localhost" # Replace this with your SMTP server address
  smtp_port = 1025 # Replace this with the appropriate SMTP port for your server
  domain = "locahost" # Replace this with your domain

  message = <<~EMAIL
    From: #{sender_email}
    To: #{recipient_email}
    Subject: #{subject}

    #{body}
  EMAIL

  begin
    Net::SMTP.start(smtp_server, smtp_port, domain, sender_email, sender_password, :plain) do |smtp|
      smtp.send_message(message, sender_email, recipient_email)
    end
    puts "Email sent successfully!"
  rescue StandardError => e
    puts "Error sending email: #{e.message}"
  end
end

# Usage example
sender_email = "your_sender_email@example.com"
sender_password = "your_sender_password"
recipient_email = "recipient@example.com"
subject = "Test Email"
body = "This is a test email sent using Ruby SMTP."

send_email(sender_email, sender_password, recipient_email, subject, body)
