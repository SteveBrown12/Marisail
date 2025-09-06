import smsHelper from '../utils/smsHelper.js';

/**
 * SMS Service
 * Provides convenient methods for sending different types of SMS
 */
class SMSService {
  /**
   * Send welcome SMS to new users
   * @param {Object} userData - User information
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.firstName - User's first name
   */
  async sendWelcomeSMS(userData) {
    if (!userData.phone) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendTemplateSMS({
      to: formattedPhone,
      template: 'welcome',
      data: {
        firstName: userData.firstName || 'there'
      }
    });
  }

  /**
   * Send verification code SMS
   * @param {Object} userData - User information
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.code - Verification code
   * @param {string} userData.type - Type of verification (default: 'verification')
   */
  async sendVerificationCodeSMS(userData) {
    if (!userData.phone || !userData.code) {
      return { success: false, error: 'Phone number and verification code are required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendVerificationCode({
      to: formattedPhone,
      code: userData.code,
      firstName: userData.firstName,
      type: userData.type || 'verification'
    });
  }

  /**
   * Send password reset SMS
   * @param {Object} userData - User information
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.code - Reset code
   */
  async sendPasswordResetSMS(userData) {
    if (!userData.phone || !userData.code) {
      return { success: false, error: 'Phone number and reset code are required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendTemplateSMS({
      to: formattedPhone,
      template: 'password-reset',
      data: {
        firstName: userData.firstName || 'there',
        code: userData.code
      }
    });
  }

  /**
   * Send listing notification SMS
   * @param {Object} userData - User information
   * @param {Object} listingData - Listing information
   */
  async sendListingNotificationSMS(userData, listingData) {
    if (!userData.phone) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendListingNotification({
      to: formattedPhone,
      firstName: userData.firstName,
      category: listingData.category,
      title: listingData.title,
      price: listingData.price,
      listingUrl: listingData.listingUrl
    });
  }

  /**
   * Send appointment reminder SMS
   * @param {Object} userData - User information
   * @param {Object} appointmentData - Appointment information
   */
  async sendAppointmentReminderSMS(userData, appointmentData) {
    if (!userData.phone) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendAppointmentReminder({
      to: formattedPhone,
      firstName: userData.firstName,
      appointmentType: appointmentData.type,
      date: appointmentData.date,
      time: appointmentData.time,
      location: appointmentData.location
    });
  }

  /**
   * Send booking confirmation SMS
   * @param {Object} userData - User information
   * @param {Object} bookingData - Booking information
   */
  async sendBookingConfirmationSMS(userData, bookingData) {
    if (!userData.phone) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendTemplateSMS({
      to: formattedPhone,
      template: 'booking-confirmation',
      data: {
        firstName: userData.firstName || 'there',
        serviceType: bookingData.serviceType,
        date: bookingData.date,
        time: bookingData.time,
        bookingId: bookingData.bookingId
      }
    });
  }

  /**
   * Send payment reminder SMS
   * @param {Object} userData - User information
   * @param {Object} paymentData - Payment information
   */
  async sendPaymentReminderSMS(userData, paymentData) {
    if (!userData.phone) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendTemplateSMS({
      to: formattedPhone,
      template: 'payment-reminder',
      data: {
        firstName: userData.firstName || 'there',
        amount: paymentData.amount,
        serviceType: paymentData.serviceType,
        dueDate: paymentData.dueDate,
        paymentUrl: paymentData.paymentUrl
      }
    });
  }

  /**
   * Send emergency notification SMS
   * @param {Object} userData - User information
   * @param {Object} emergencyData - Emergency information
   */
  async sendEmergencyNotificationSMS(userData, emergencyData) {
    if (!userData.phone) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(userData.phone);
    
    return await smsHelper.sendEmergencyNotification({
      to: formattedPhone,
      firstName: userData.firstName,
      message: emergencyData.message,
      actionUrl: emergencyData.actionUrl,
      priority: emergencyData.priority || 'high'
    });
  }

  /**
   * Send general notification SMS
   * @param {Object} options - Notification options
   */
  async sendGeneralNotificationSMS(options) {
    if (!options.to) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(options.to);
    
    return await smsHelper.sendTemplateSMS({
      to: formattedPhone,
      template: 'general-notification',
      data: {
        firstName: options.firstName || 'there',
        message: options.message,
        actionUrl: options.actionUrl,
        actionText: options.actionText
      }
    });
  }

  /**
   * Send custom SMS with any template
   * @param {Object} options - SMS options
   */
  async sendCustomSMS(options) {
    if (!options.to) {
      return { success: false, error: 'Phone number is required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(options.to);
    
    return await smsHelper.sendTemplateSMS({
      to: formattedPhone,
      template: options.template,
      data: options.data
    });
  }

  /**
   * Send simple SMS without template
   * @param {Object} options - SMS options
   */
  async sendSimpleSMS(options) {
    if (!options.to || !options.message) {
      return { success: false, error: 'Phone number and message are required' };
    }

    const formattedPhone = smsHelper.formatPhoneNumber(options.to);
    
    return await smsHelper.sendSimpleSMS({
      to: formattedPhone,
      message: options.message
    });
  }

  /**
   * Verify Twilio connection
   */
  async verifyConnection() {
    return await smsHelper.verifyConnection();
  }

  /**
   * Get SMS message status
   * @param {string} messageId - Twilio message SID
   */
  async getMessageStatus(messageId) {
    return await smsHelper.getMessageStatus(messageId);
  }

  /**
   * Format phone number to E.164 format
   * @param {string} phoneNumber - Phone number to format
   * @param {string} countryCode - Country code (default: 'US')
   */
  formatPhoneNumber(phoneNumber, countryCode = 'US') {
    return smsHelper.formatPhoneNumber(phoneNumber, countryCode);
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   */
  validatePhoneNumber(phoneNumber) {
    return smsHelper.validatePhoneNumber(phoneNumber);
  }
}

// Create and export a singleton instance
const smsService = new SMSService();
export default smsService;
