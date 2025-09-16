import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Email Helper Class
 * Handles email sending using Gmail SMTP with template support
 */
class EmailHelper {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stephenwdo@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
      }
    });
    
    this.defaultFrom = 'stephenwdo@gmail.com';
    this.defaultFromName = 'Marisail Team';
  }

  /**
   * Send email using a template
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.template - Template name
   * @param {Object} options.data - Template data
   * @param {string} options.from - Sender email (optional)
   * @param {string} options.fromName - Sender name (optional)
   */
  async sendTemplateEmail(options) {
    try {
      const { to, subject, template, data, from, fromName } = options;
      
      // Get template HTML
      const htmlContent = this.getTemplate(template, data);
      
      const mailOptions = {
        from: `"${fromName || this.defaultFromName}" <${from || this.defaultFrom}>`,
        to: to,
        subject: subject,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send simple email without template
   * @param {Object} options - Email options
   */
  async sendSimpleEmail(options) {
    try {
      const { to, subject, text, html, from, fromName } = options;
      
      const mailOptions = {
        from: `"${fromName || this.defaultFromName}" <${from || this.defaultFrom}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get email template with dynamic data
   * @param {string} templateName - Template name
   * @param {Object} data - Template data
   */
  getTemplate(templateName, data = {}) {
    const templates = {
      // Welcome email template
      'welcome': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Marisail</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .footer { background: #e2e8f0; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚢 Welcome to Marisail!</h1>
              <p>Your maritime marketplace journey begins here</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.firstName || 'there'}!</h2>
              
              <p>Welcome aboard! We're excited to have you join the Marisail community.</p>
              
              <div class="highlight">
                <strong>What you can do now:</strong>
                <ul>
                  <li>Browse boats, berths, engines, and more</li>
                  <li>Create listings for your maritime assets</li>
                  <li>Connect with other maritime enthusiasts</li>
                  <li>Access exclusive member benefits</li>
                </ul>
              </div>
              
              <p>Ready to get started? Explore our marketplace:</p>
              <a href="${data.siteUrl || 'https://marisail.com'}" class="button">Explore Marisail</a>
              
              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Best regards,<br>The Marisail Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Marisail. All rights reserved.</p>
              <p>This email was sent to ${data.email}. If you didn't sign up for Marisail, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      // Password reset template
      'password-reset': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - Marisail</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .footer { background: #e2e8f0; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning { background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>Marisail Account Security</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.firstName || 'there'}!</h2>
              
              <p>We received a request to reset your password for your Marisail account.</p>
              
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </div>
              
              <p>Click the button below to reset your password:</p>
              <a href="${data.resetUrl}" class="button">Reset Password</a>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 4px; font-size: 12px;">${data.resetUrl}</p>
              
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              
              <p>Best regards,<br>The Marisail Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Marisail. All rights reserved.</p>
              <p>This email was sent to ${data.email}. If you didn't request a password reset, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      // Listing notification template
      'listing-notification': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Listing Alert - Marisail</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .footer { background: #e2e8f0; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .listing-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Listing Alert</h1>
              <p>Fresh maritime listings just for you</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.firstName || 'there'}!</h2>
              
              <p>Great news! We found new ${data.category || 'listings'} that match your interests.</p>
              
              <div class="listing-card">
                <h3>${data.title || 'New Listing'}</h3>
                <p><strong>Category:</strong> ${data.category || 'N/A'}</p>
                <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                <p><strong>Price:</strong> ${data.price || 'N/A'}</p>
                ${data.description ? `<p><strong>Description:</strong> ${data.description}</p>` : ''}
              </div>
              
              <p>Don't miss out! Check out this listing now:</p>
              <a href="${data.listingUrl}" class="button">View Listing</a>
              
              <p>Happy sailing!<br>The Marisail Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Marisail. All rights reserved.</p>
              <p>You're receiving this email because you're subscribed to ${data.category || 'listing'} notifications.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      // Contact form submission template
      'contact-form': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission - Marisail</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .footer { background: #e2e8f0; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-radius: 0 0 10px 10px; }
            .form-data { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #374151; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
              <p>Marisail Support</p>
            </div>
            
            <div class="content">
              <h2>New Contact Form Submission</h2>
              
              <p>A new contact form has been submitted on Marisail.</p>
              
              <div class="form-data">
                <div class="field">
                  <span class="label">Name:</span> ${data.name || 'N/A'}
                </div>
                <div class="field">
                  <span class="label">Email:</span> ${data.email || 'N/A'}
                </div>
                <div class="field">
                  <span class="label">Subject:</span> ${data.subject || 'N/A'}
                </div>
                <div class="field">
                  <span class="label">Message:</span><br>
                  <p style="margin-top: 5px;">${data.message || 'N/A'}</p>
                </div>
                ${data.phone ? `<div class="field"><span class="label">Phone:</span> ${data.phone}</div>` : ''}
                ${data.company ? `<div class="field"><span class="label">Company:</span> ${data.company}</div>` : ''}
              </div>
              
              <p>Please respond to this inquiry as soon as possible.</p>
              
              <p>Best regards,<br>Marisail System</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Marisail. All rights reserved.</p>
              <p>This is an automated notification from the Marisail contact form system.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      // Generic notification template
      'notification': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.subject || 'Notification'} - Marisail</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .footer { background: #e2e8f0; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${data.icon || '📢'} ${data.title || 'Notification'}</h1>
              <p>${data.subtitle || 'Marisail Update'}</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.firstName || 'there'}!</h2>
              
              ${data.message ? `<p>${data.message}</p>` : ''}
              
              ${data.highlight ? `<div class="highlight">${data.highlight}</div>` : ''}
              
              ${data.actionUrl ? `
                <p>${data.actionText || 'Click the button below to take action:'}</p>
                <a href="${data.actionUrl}" class="button">${data.actionButton || 'Take Action'}</a>
              ` : ''}
              
              <p>Best regards,<br>The Marisail Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Marisail. All rights reserved.</p>
              <p>This email was sent to ${data.email || 'your email'}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    // Replace placeholders with actual data
    return template.replace(/\${([^}]+)}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * Verify email configuration
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const emailHelper = new EmailHelper();
export default emailHelper;
