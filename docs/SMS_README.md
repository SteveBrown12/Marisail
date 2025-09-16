# Marisail SMS System

A comprehensive SMS system built with Twilio, featuring template support and easy-to-use service methods for maritime marketplace notifications.

## 🚀 Features

- **Twilio Integration** - Uses Twilio's reliable SMS service
- **Template System** - Pre-built SMS templates for common use cases
- **Phone Number Formatting** - Automatic E.164 formatting for international numbers
- **Multiple SMS Types** - Welcome, verification, notifications, reminders, and more
- **Error Handling** - Graceful fallbacks and detailed logging
- **Service Layer** - Clean, reusable SMS service methods

## 📱 Available SMS Templates

### 1. Welcome SMS (`welcome`)
- **Purpose**: Sent to new users after registration
- **Template Variables**: `firstName`
- **Usage**: `smsService.sendWelcomeSMS(userData)`

### 2. Verification Code (`verification-code`)
- **Purpose**: Phone verification and authentication codes
- **Template Variables**: `firstName`, `code`, `type`
- **Usage**: `smsService.sendVerificationCodeSMS(userData)`

### 3. Password Reset (`password-reset`)
- **Purpose**: Password reset requests
- **Template Variables**: `firstName`, `code`
- **Usage**: `smsService.sendPasswordResetSMS(userData)`

### 4. Listing Notification (`listing-notification`)
- **Purpose**: Notify users about new listings
- **Template Variables**: `firstName`, `category`, `title`, `price`, `listingUrl`
- **Usage**: `smsService.sendListingNotificationSMS(userData, listingData)`

### 5. Appointment Reminder (`appointment-reminder`)
- **Purpose**: Remind users about scheduled appointments
- **Template Variables**: `firstName`, `appointmentType`, `date`, `time`, `location`
- **Usage**: `smsService.sendAppointmentReminderSMS(userData, appointmentData)`

### 6. Booking Confirmation (`booking-confirmation`)
- **Purpose**: Confirm service bookings
- **Template Variables**: `firstName`, `serviceType`, `date`, `time`, `bookingId`
- **Usage**: `smsService.sendBookingConfirmationSMS(userData, bookingData)`

### 7. Payment Reminder (`payment-reminder`)
- **Purpose**: Remind users about pending payments
- **Template Variables**: `firstName`, `amount`, `serviceType`, `dueDate`, `paymentUrl`
- **Usage**: `smsService.sendPaymentReminderSMS(userData, paymentData)`

### 8. Emergency Notification (`emergency-notification`)
- **Purpose**: Send urgent/emergency messages
- **Template Variables**: `firstName`, `message`, `actionUrl`, `priority`
- **Usage**: `smsService.sendEmergencyNotificationSMS(userData, emergencyData)`

### 9. General Notification (`general-notification`)
- **Purpose**: Custom notifications with flexible content
- **Template Variables**: `firstName`, `message`, `actionUrl`, `actionText`
- **Usage**: `smsService.sendGeneralNotificationSMS(options)`

## ⚙️ Setup

### 1. Environment Variables
Add to your `.env` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Optional: Site URL for SMS links
SITE_URL=https://marisail.com
```

### 2. Twilio Account Setup
1. Create a Twilio account at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number or use a trial number
4. Add the credentials to your environment variables

### 3. Install Dependencies
```bash
npm install twilio
```

## 📖 Usage Examples

### Basic SMS Service Usage

```javascript
import smsService from '../services/smsService.js';

// Send welcome SMS
const result = await smsService.sendWelcomeSMS({
  phone: '+1234567890',
  firstName: 'John'
});

// Send verification code SMS
const result = await smsService.sendVerificationCodeSMS({
  phone: '+1234567890',
  firstName: 'John',
  code: '123456',
  type: 'verification'
});

// Send listing notification
const result = await smsService.sendListingNotificationSMS(
  { phone: '+1234567890', firstName: 'John' },
  {
    category: 'Boat',
    title: 'Beautiful Sailboat for Sale',
    price: '$50,000',
    listingUrl: 'https://marisail.com/boats/123'
  }
);
```

### Direct SMS Helper Usage

```javascript
import smsHelper from '../utils/smsHelper.js';

// Send custom template SMS
const result = await smsHelper.sendTemplateSMS({
  to: '+1234567890',
  template: 'general-notification',
  data: {
    firstName: 'John',
    message: 'Custom message here',
    actionUrl: 'https://marisail.com/offer',
    actionText: 'View Offer'
  }
});

// Send simple SMS
const result = await smsHelper.sendSimpleSMS({
  to: '+1234567890',
  message: 'Simple text message'
});
```

### Integration with Auth Routes

The SMS system is automatically integrated with:

- **User Registration** (`POST /api/auth/register`) - Sends welcome SMS if phone provided
- **Auth0 User Sync** (`POST /api/auth/sync`) - Sends welcome SMS for new users with phone

## 🧪 Testing

### Test Routes Available

- `GET /api/sms-test/verify` - Test Twilio connection
- `POST /api/sms-test/welcome` - Test welcome SMS
- `POST /api/sms-test/verification-code` - Test verification code SMS
- `POST /api/sms-test/password-reset` - Test password reset SMS
- `POST /api/sms-test/listing-notification` - Test listing notification
- `POST /api/sms-test/appointment-reminder` - Test appointment reminder
- `POST /api/sms-test/simple` - Test simple SMS
- `GET /api/sms-test/status/:messageId` - Get message status
- `POST /api/sms-test/format-phone` - Test phone number formatting

### Example Test Requests

```bash
# Test welcome SMS
curl -X POST http://localhost:3001/api/sms-test/welcome \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "firstName": "Test User"}'

# Test verification code SMS
curl -X POST http://localhost:3001/api/sms-test/verification-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "firstName": "Test User", "code": "123456"}'

# Test listing notification
curl -X POST http://localhost:3001/api/sms-test/listing-notification \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "firstName": "Test User",
    "listingData": {
      "category": "Boat",
      "title": "Test Boat",
      "price": "$10,000",
      "listingUrl": "https://example.com/boat/123"
    }
  }'

# Test phone number formatting
curl -X POST http://localhost:3001/api/sms-test/format-phone \
  -H "Content-Type: application/json" \
  -d '{"phone": "123-456-7890", "countryCode": "US"}'
```

## 🔧 Customization

### Adding New Templates

1. Add template message to `getTemplate()` method in `smsHelper.js`
2. Add corresponding method to `smsService.js`
3. Use the new template with `smsHelper.sendTemplateSMS()`

### Template Variables

Templates use `${variableName}` syntax for dynamic content:

```javascript
// Example template
'custom-template': `Hi ${firstName}! Your ${serviceType} is ready. Call ${phoneNumber} for details.`
```

### Phone Number Formatting

The system automatically formats phone numbers to E.164 format (required by Twilio):

- `(123) 456-7890` → `+11234567890`
- `123-456-7890` → `+11234567890`
- `+44 20 7946 0958` → `+442079460958`

## 🚨 Troubleshooting

### Common Issues

1. **"Authentication failed" error**
   - Verify your `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
   - Check that your Twilio account is active

2. **"Invalid phone number" error**
   - Ensure phone numbers include country code
   - Use the phone formatting utilities provided

3. **"Template not found" error**
   - Check template name spelling
   - Ensure template exists in `getTemplate()` method

### Debug Mode

Enable detailed logging by checking console output:
- SMS sending attempts
- Success/failure messages
- Error details
- Twilio message SIDs

### Testing Connection

Use the verification endpoint to test your setup:
```bash
curl http://localhost:3001/api/sms-test/verify
```

## 📱 SMS Best Practices

1. **Keep messages concise** - SMS has character limits
2. **Include opt-out instructions** - "Reply STOP to unsubscribe"
3. **Use clear call-to-actions** - Include URLs when relevant
4. **Test with real numbers** - Verify delivery and formatting
5. **Monitor delivery rates** - Track success/failure metrics
6. **Respect sending hours** - Avoid sending late at night

## 🔒 Security Notes

- **Never commit** your Twilio credentials to version control
- **Use environment variables** for sensitive configuration
- **Monitor SMS usage** to prevent abuse
- **Implement rate limiting** for verification codes
- **Validate phone numbers** before sending

## 💰 Cost Considerations

- **Twilio pricing** varies by country and message type
- **International SMS** costs more than domestic
- **Bulk messaging** may qualify for volume discounts
- **Monitor usage** to control costs

## 📞 Support

For issues or questions about the SMS system:
1. Check the console logs for error details
2. Verify your Twilio credentials
3. Test with the provided test endpoints
4. Review this documentation for common solutions
5. Check Twilio's documentation for service-specific issues

## 🔗 Twilio Resources

- [Twilio Console](https://console.twilio.com/)
- [SMS API Documentation](https://www.twilio.com/docs/sms)
- [Phone Number Management](https://www.twilio.com/docs/phone-numbers)
- [Best Practices](https://www.twilio.com/docs/sms/quickstart/best-practices)
