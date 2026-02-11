"""
Email sending utilities (optional feature).
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from app.core.config import settings


def send_email(
    to_email: str,
    subject: str,
    body: str,
    html: Optional[str] = None
) -> bool:
    """
    Send email using SMTP.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        body: Plain text email body
        html: Optional HTML email body
        
    Returns:
        True if email was sent successfully, False otherwise
    """
    # Check if email is configured
    if not all([
        settings.SMTP_HOST,
        settings.SMTP_PORT,
        settings.SMTP_USER,
        settings.SMTP_PASSWORD,
        settings.EMAILS_FROM_EMAIL
    ]):
        print("Email not configured. Skipping email send.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add plain text part
        text_part = MIMEText(body, 'plain')
        msg.attach(text_part)
        
        # Add HTML part if provided
        if html:
            html_part = MIMEText(html, 'html')
            msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False


def send_contact_notification(name: str, email: str, message: str) -> bool:
    """
    Send notification email for new contact form submission.
    
    Args:
        name: Contact name
        email: Contact email
        message: Contact message
        
    Returns:
        True if email was sent successfully
    """
    subject = f"New Contact Form Submission from {name}"
    
    body = f"""
New contact form submission:

Name: {name}
Email: {email}
Message:
{message}

---
Sent from 3D Portfolio Contact Form
    """
    
    html = f"""
<html>
<body>
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Message:</strong></p>
    <p>{message}</p>
    <hr>
    <p><small>Sent from 3D Portfolio Contact Form</small></p>
</body>
</html>
    """
    
    # Send to admin email
    admin_email = settings.EMAILS_FROM_EMAIL
    return send_email(admin_email, subject, body, html)


def send_welcome_email(to_email: str, name: str) -> bool:
    """
    Send welcome email to new user.
    
    Args:
        to_email: User email
        name: User name
        
    Returns:
        True if email was sent successfully
    """
    subject = f"Welcome to {settings.APP_NAME}!"
    
    body = f"""
Hi {name},

Welcome to {settings.APP_NAME}!

Your account has been created successfully.

Best regards,
{settings.APP_NAME} Team
    """
    
    html = f"""
<html>
<body>
    <h2>Welcome to {settings.APP_NAME}!</h2>
    <p>Hi {name},</p>
    <p>Your account has been created successfully.</p>
    <p>Best regards,<br>{settings.APP_NAME} Team</p>
</body>
</html>
    """
    
    return send_email(to_email, subject, body, html)
