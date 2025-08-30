import emailHelper from '../utils/emailHelper.js';

/**
 * Email Service
 * Provides convenient methods for sending different types of emails
 */
class EmailService {
  /**
   * Send welcome email to new users
   * @param {Object} userData - User information
   * @param {string} userData.email - User's email address
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.siteUrl - Site URL for the welcome email
   */
  async sendWelcomeEmail(userData) {
    return await emailHelper.sendTemplateEmail({
      to: userData.email,
      subject: 'Welcome to Marisail - Your Maritime Marketplace Journey Begins!',
      template: 'welcome',
      data: {
        email: userData.email,
        firstName: userData.firstName,
        siteUrl: userData.siteUrl || 'https://marisail.com'
      }
    });
  }

  /**
   * Send password reset email
   * @param {Object} userData - User information
   * @param {string} userData.email - User's email address
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.resetUrl - Password reset URL
   */
  async sendPasswordResetEmail(userData) {
    return await emailHelper.sendTemplateEmail({
      to: userData.email,
      subject: 'Reset Your Marisail Password',
      template: 'password-reset',
      data: {
        email: userData.email,
        firstName: userData.firstName,
        resetUrl: userData.resetUrl
      }
    });
  }

  /**
   * Send listing notification email
   * @param {Object} userData - User information
   * @param {Object} listingData - Listing information
   */
  async sendListingNotificationEmail(userData, listingData) {
    return await emailHelper.sendTemplateEmail({
      to: userData.email,
      subject: `New ${listingData.category} Listing Alert - Marisail`,
      template: 'listing-notification',
      data: {
        email: userData.email,
        firstName: userData.firstName,
        category: listingData.category,
        title: listingData.title,
        location: listingData.location,
        price: listingData.price,
        description: listingData.description,
        listingUrl: listingData.listingUrl
      }
    });
  }

  /**
   * Send contact form notification to admin
   * @param {Object} formData - Contact form data
   * @param {string} adminEmail - Admin email to receive the notification
   */
  async sendContactFormNotification(formData, adminEmail) {
    return await emailHelper.sendTemplateEmail({
      to: adminEmail,
      subject: 'New Contact Form Submission - Marisail',
      template: 'contact-form',
      data: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.phone,
        company: formData.company
      }
    });
  }

  /**
   * Send generic notification email
   * @param {Object} options - Notification options
   */
  async sendNotificationEmail(options) {
    return await emailHelper.sendTemplateEmail({
      to: options.to,
      subject: options.subject,
      template: 'notification',
      data: {
        email: options.to,
        firstName: options.firstName,
        subject: options.subject,
        message: options.message,
        icon: options.icon,
        title: options.title,
        subtitle: options.subtitle,
        highlight: options.highlight,
        actionUrl: options.actionUrl,
        actionText: options.actionText,
        actionButton: options.actionButton
      }
    });
  }

  /**
   * Send custom email with any template
   * @param {Object} options - Email options
   */
  async sendCustomEmail(options) {
    return await emailHelper.sendTemplateEmail(options);
  }

  /**
   * Send simple text email
   * @param {Object} options - Email options
   */
  async sendSimpleEmail(options) {
    return await emailHelper.sendSimpleEmail(options);
  }

  /**
   * Verify email server connection
   */
  async verifyConnection() {
    return await emailHelper.verifyConnection();
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
