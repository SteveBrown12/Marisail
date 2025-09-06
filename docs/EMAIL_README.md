# Marisail Email System

A comprehensive email system built with Nodemailer and Gmail SMTP, featuring beautiful HTML templates and easy-to-use service methods.

## 🚀 Features

- **Gmail SMTP Integration** - Uses Gmail's secure SMTP server
- **HTML Email Templates** - Beautiful, responsive email designs
- **Template System** - Dynamic content replacement with placeholders
- **Multiple Email Types** - Welcome, password reset, notifications, and more
- **Error Handling** - Graceful fallbacks and detailed logging
- **Service Layer** - Clean, reusable email service methods

## 📧 Available Email Templates

### 1. Welcome Email (`welcome`)
- **Purpose**: Sent to new users after registration
- **Template Variables**: `firstName`, `email`, `siteUrl`
- **Usage**: `emailService.sendWelcomeEmail(userData)`

### 2. Password Reset (`password-reset`)
- **Purpose**: Password reset requests
- **Template Variables**: `firstName`, `email`, `resetUrl`
- **Usage**: `emailService.sendPasswordResetEmail(userData)`

### 3. Listing Notification (`listing-notification`)
- **Purpose**: Notify users about new listings
- **Template Variables**: `firstName`, `email`, `category`, `title`, `location`, `price`, `description`, `listingUrl`
- **Usage**: `emailService.sendListingNotificationEmail(userData, listingData)`

### 4. Contact Form (`contact-form`)
- **Purpose**: Admin notifications for contact form submissions
- **Template Variables**: `name`, `email`, `subject`, `message`, `phone`, `company`
- **Usage**: `emailService.sendContactFormNotification(formData, adminEmail)`

### 5. Generic Notification (`notification`)
- **Purpose**: Custom notifications with flexible content
- **Template Variables**: `firstName`, `email`, `subject`, `message`, `icon`, `title`, `subtitle`, `highlight`, `actionUrl`, `actionText`, `actionButton`
- **Usage**: `emailService.sendNotificationEmail(options)`

## ⚙️ Setup

### 1. Environment Variables
Add to your `.env` file:

```bash
# Gmail App Password (NOT your regular Gmail password)
GMAIL_APP_PASSWORD=your_16_character_app_password

# Optional: Site URL for emails
SITE_URL=https://marisail.com
```

### 2. Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App Passwords
3. Generate an app password for "Mail"
4. Use the 16-character password in `GMAIL_APP_PASSWORD`

### 3. Install Dependencies
```bash
npm install nodemailer
```

## 📖 Usage Examples

### Basic Email Service Usage

```javascript
import emailService from '../services/emailService.js';

// Send welcome email
const result = await emailService.sendWelcomeEmail({
  email: 'user@example.com',
  firstName: 'John',
  siteUrl: 'https://marisail.com'
});

// Send password reset email
const result = await emailService.sendPasswordResetEmail({
  email: 'user@example.com',
  firstName: 'John',
  resetUrl: 'https://marisail.com/reset?token=abc123'
});

// Send listing notification
const result = await emailService.sendListingNotificationEmail(
  { email: 'user@example.com', firstName: 'John' },
  {
    category: 'Boat',
    title: 'Beautiful Sailboat for Sale',
    location: 'Miami, FL',
    price: '$50,000',
    description: 'Perfect condition sailboat...',
    listingUrl: 'https://marisail.com/boats/123'
  }
);
```

### Direct Email Helper Usage

```javascript
import emailHelper from '../utils/emailHelper.js';

// Send custom template email
const result = await emailHelper.sendTemplateEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  template: 'notification',
  data: {
    firstName: 'John',
    message: 'Custom message here',
    icon: '🎉',
    title: 'Special Offer',
    actionUrl: 'https://marisail.com/offer',
    actionButton: 'Claim Offer'
  }
});

// Send simple email
const result = await emailHelper.sendSimpleEmail({
  to: 'user@example.com',
  subject: 'Simple Subject',
  text: 'Plain text version',
  html: '<h1>HTML version</h1>'
});
```

### Integration with Auth Routes

The email system is automatically integrated with:

- **User Registration** (`POST /api/auth/register`) - Sends welcome email
- **Auth0 User Sync** (`POST /api/auth/sync`) - Sends welcome email for new users

## 🧪 Testing

### Test Routes Available

- `GET /api/email-test/verify` - Test email server connection
- `POST /api/email-test/welcome` - Test welcome email
- `POST /api/email-test/password-reset` - Test password reset email
- `POST /api/email-test/listing-notification` - Test listing notification
- `POST /api/email-test/contact-form` - Test contact form notification

### Example Test Requests

```bash
# Test welcome email
curl -X POST http://localhost:3001/api/email-test/welcome \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "firstName": "Test User"}'

# Test password reset email
curl -X POST http://localhost:3001/api/email-test/password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "firstName": "Test User", "resetUrl": "https://example.com/reset"}'

# Test listing notification
curl -X POST http://localhost:3001/api/email-test/listing-notification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test User",
    "listingData": {
      "category": "Boat",
      "title": "Test Boat",
      "location": "Test Location",
      "price": "$10,000",
      "description": "Test description",
      "listingUrl": "https://example.com/boat/123"
    }
  }'
```

## 🔧 Customization

### Adding New Templates

1. Add template HTML to `getTemplate()` method in `emailHelper.js`
2. Add corresponding method to `emailService.js`
3. Use the new template with `emailHelper.sendTemplateEmail()`

### Template Variables

Templates use `${variableName}` syntax for dynamic content:

```html
<h1>Hello ${firstName}!</h1>
<p>Your email: ${email}</p>
<a href="${actionUrl}">${actionButton}</a>
```

### Styling

All templates include:
- Responsive design
- Modern CSS with gradients and shadows
- Consistent branding colors
- Mobile-friendly layout

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Ensure you're using an App Password, not your regular Gmail password
   - Verify 2FA is enabled on your Gmail account

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify Gmail SMTP settings are correct

3. **"Template not found" error**
   - Check template name spelling
   - Ensure template exists in `getTemplate()` method

### Debug Mode

Enable detailed logging by checking console output:
- Email sending attempts
- Success/failure messages
- Error details

### Testing Connection

Use the verification endpoint to test your setup:
```bash
curl http://localhost:3001/api/email-test/verify
```

## 📝 Best Practices

1. **Always handle email errors gracefully** - Don't let email failures break your app
2. **Use try-catch blocks** around email sending operations
3. **Log email operations** for debugging and monitoring
4. **Test templates** before sending to real users
5. **Keep templates responsive** for mobile users
6. **Use meaningful subject lines** to improve open rates

## 🔒 Security Notes

- **Never commit** your `GMAIL_APP_PASSWORD` to version control
- **Use App Passwords** instead of regular Gmail passwords
- **Enable 2FA** on your Gmail account
- **Monitor email usage** to prevent abuse

## 📞 Support

For issues or questions about the email system:
1. Check the console logs for error details
2. Verify your Gmail App Password setup
3. Test with the provided test endpoints
4. Review this documentation for common solutions
