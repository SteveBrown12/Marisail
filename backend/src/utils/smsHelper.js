import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SMS Helper Class
 * Handles SMS sending using Twilio with template support
 */
class SMSHelper {
  constructor() {
    // Initialize Twilio client
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.defaultFrom = this.fromNumber || '+1234567890'; // Fallback number
  }

  /**
   * Send SMS using a template
   * @param {Object} options - SMS options
   * @param {string} options.to - Recipient phone number (with country code)
   * @param {string} options.template - Template name
   * @param {Object} options.data - Template data
   * @param {string} options.from - Sender phone number (optional)
   */
  async sendTemplateSMS(options) {
    try {
      const { to, template, data, from } = options;
      
      // Get template message
      const messageContent = this.getTemplate(template, data);
      
      const messageOptions = {
        body: messageContent,
        from: from || this.defaultFrom,
        to: to
      };

      const result = await this.client.messages.create(messageOptions);
      console.log('SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid, status: result.status };
      
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send simple SMS without template
   * @param {Object} options - SMS options
   */
  async sendSimpleSMS(options) {
    try {
      const { to, message, from } = options;
      
      const messageOptions = {
        body: message,
        from: from || this.defaultFrom,
        to: to
      };

      const result = await this.client.messages.create(messageOptions);
      console.log('SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid, status: result.status };
      
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send verification code SMS
   * @param {Object} options - Verification options
   */
  async sendVerificationCode(options) {
    try {
      const { to, code, firstName, type = 'verification' } = options;
      
      const messageContent = this.getTemplate('verification-code', {
        firstName: firstName || 'there',
        code: code,
        type: type
      });

      const messageOptions = {
        body: messageContent,
        from: this.defaultFrom,
        to: to
      };

      const result = await this.client.messages.create(messageOptions);
      console.log('Verification SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid, status: result.status };
      
    } catch (error) {
      console.error('Verification SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send appointment reminder SMS
   * @param {Object} options - Appointment options
   */
  async sendAppointmentReminder(options) {
    try {
      const { to, firstName, appointmentType, date, time, location } = options;
      
      const messageContent = this.getTemplate('appointment-reminder', {
        firstName: firstName || 'there',
        appointmentType: appointmentType,
        date: date,
        time: time,
        location: location
      });

      const messageOptions = {
        body: messageContent,
        from: this.defaultFrom,
        to: to
      };

      const result = await this.client.messages.create(messageOptions);
      console.log('Appointment reminder SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid, status: result.status };
      
    } catch (error) {
      console.error('Appointment reminder SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send listing notification SMS
   * @param {Object} options - Listing notification options
   */
  async sendListingNotification(options) {
    try {
      const { to, firstName, category, title, price, listingUrl } = options;
      
      const messageContent = this.getTemplate('listing-notification', {
        firstName: firstName || 'there',
        category: category,
        title: title,
        price: price,
        listingUrl: listingUrl
      });

      const messageOptions = {
        body: messageContent,
        from: this.defaultFrom,
        to: to
      };

      const result = await this.client.messages.create(messageOptions);
      console.log('Listing notification SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid, status: result.status };
      
    } catch (error) {
      console.error('Listing notification SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send emergency/urgent notification SMS
   * @param {Object} options - Emergency notification options
   */
  async sendEmergencyNotification(options) {
    try {
      const { to, firstName, message, actionUrl, priority = 'high' } = options;
      
      const messageContent = this.getTemplate('emergency-notification', {
        firstName: firstName || 'there',
        message: message,
        actionUrl: actionUrl,
        priority: priority
      });

      const messageOptions = {
        body: messageContent,
        from: this.defaultFrom,
        to: to
      };

      const result = await this.client.messages.create(messageOptions);
      console.log('Emergency notification SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid, status: result.status };
      
    } catch (error) {
      console.error('Emergency notification SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get SMS template with dynamic data
   * @param {string} templateName - Template name
   * @param {Object} data - Template data
   */
  getTemplate(templateName, data = {}) {
    const templates = {
      // Verification code template
      'verification-code': `Marisail ${data.type || 'verification'} code: ${data.code}. Valid for 10 minutes. Don't share this code with anyone.`,
      
      // Welcome SMS template
      'welcome': `Welcome to Marisail, ${data.firstName}! Your maritime marketplace account is now active. Start exploring boats, berths, and more at marisail.com`,
      
      // Appointment reminder template
      'appointment-reminder': `Hi ${data.firstName}! Reminder: Your ${data.appointmentType} is scheduled for ${data.date} at ${data.time}${data.location ? ` at ${data.location}` : ''}. Reply STOP to unsubscribe.`,
      
      // Listing notification template
      'listing-notification': `Hi ${data.firstName}! New ${data.category} listing: ${data.title}${data.price ? ` - ${data.price}` : ''}. View at: ${data.listingUrl}. Reply STOP to unsubscribe.`,
      
      // Emergency notification template
      'emergency-notification': `🚨 URGENT: ${data.message}${data.actionUrl ? `\n\nTake action: ${data.actionUrl}` : ''}. Reply STOP to unsubscribe.`,
      
      // Password reset template
      'password-reset': `Hi ${data.firstName}! Your Marisail password reset code is: ${data.code}. Valid for 10 minutes. Don't share this code.`,
      
      // Booking confirmation template
      'booking-confirmation': `Hi ${data.firstName}! Your ${data.serviceType} booking is confirmed for ${data.date} at ${data.time}. Booking ID: ${data.bookingId}. Reply STOP to unsubscribe.`,
      
      // Payment reminder template
      'payment-reminder': `Hi ${data.firstName}! Payment reminder: ${data.amount} due for ${data.serviceType} on ${data.dueDate}. Pay at: ${data.paymentUrl}. Reply STOP to unsubscribe.`,
      
      // General notification template
      'general-notification': `Hi ${data.firstName}! ${data.message}${data.actionUrl ? `\n\n${data.actionText || 'Click here'}: ${data.actionUrl}` : ''}. Reply STOP to unsubscribe.`
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
   * Verify Twilio configuration
   */
  async verifyConnection() {
    try {
      // Try to get account info to verify credentials
      const account = await this.client.api.accounts(this.client.accountSid).fetch();
      console.log('Twilio connection verified successfully');
      return { success: true, accountSid: account.sid, status: account.status };
    } catch (error) {
      console.error('Twilio connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get message status
   * @param {string} messageId - Twilio message SID
   */
  async getMessageStatus(messageId) {
    try {
      const message = await this.client.messages(messageId).fetch();
      return { success: true, status: message.status, errorCode: message.errorCode };
    } catch (error) {
      console.error('Failed to get message status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format phone number to E.164 format (required by Twilio)
   * @param {string} phoneNumber - Phone number to format
   * @param {string} countryCode - Country code (default: 'US')
   */
  formatPhoneNumber(phoneNumber, countryCode = 'US') {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Add country code if not present
    if (!cleaned.startsWith('1') && countryCode === 'US') {
      cleaned = '1' + cleaned;
    }
    
    // Ensure it's a valid length
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return '+' + cleaned;
    } else if (cleaned.length === 10) {
      return '+1' + cleaned;
    }
    
    // Return as is if we can't determine format
    return '+' + cleaned;
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   */
  validatePhoneNumber(phoneNumber) {
    // Basic validation - should start with + and have 10-15 digits
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}

// Create and export a singleton instance
const smsHelper = new SMSHelper();
export default smsHelper;
