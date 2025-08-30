# Marisail Setup Guide

This guide explains how to configure the environment variables needed for the email and SMS systems to work properly.

## 🔧 Environment Variables Setup

Create or update your `node-api/.env` file with the following variables:

### Required for Email System (Gmail)

```bash
# Gmail App Password (NOT your regular Gmail password)
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

**How to get Gmail App Password:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App Passwords
3. Generate an app password for "Mail"
4. Use the 16-character password in `GMAIL_APP_PASSWORD`

### Required for SMS System (Twilio)

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**How to get Twilio credentials:**
1. Create account at [twilio.com](https://twilio.com)
2. Get Account SID and Auth Token from Twilio Console
3. Purchase a phone number or use trial number

### Required for Auth0

```bash
# Auth0 Configuration
AUTH0_DOMAIN=marisail.us.auth0.com
AUTH0_AUDIENCE=https://marisail.us.auth0.com/api/v2/
```

### Optional

```bash
# Site URL for emails and SMS links
SITE_URL=https://marisail.com
```

## 📧 Email System Issues

If you see this error:
```
Email sending failed: Error: Missing credentials for "PLAIN"
```

**Solution:** Set the `GMAIL_APP_PASSWORD` environment variable.

## 📱 SMS System Issues

If you see this error:
```
Twilio connection failed: [AuthError] Http 401 error
```

**Solution:** Verify your `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`.

## 🧪 Testing

After setting up the environment variables:

1. **Test Email System:**
   ```bash
   curl http://localhost:3001/api/email-test/verify
   ```

2. **Test SMS System:**
   ```bash
   curl http://localhost:3001/api/sms-test/verify
   ```

3. **Test Welcome Email:**
   ```bash
   curl -X POST http://localhost:3001/api/email-test/welcome \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "firstName": "Test User"}'
   ```

4. **Test Welcome SMS:**
   ```bash
   curl -X POST http://localhost:3001/api/sms-test/welcome \
     -H "Content-Type: application/json" \
     -d '{"phone": "+1234567890", "firstName": "Test User"}'
   ```

## ⚠️ Important Notes

- **Never commit** your `.env` file to version control
- **Use App Passwords** for Gmail, not regular passwords
- **Enable 2FA** on your Gmail account before generating app passwords
- **Verify Twilio account** is active and has sufficient credits
- **Test with real phone numbers** for SMS functionality

## 🔍 Troubleshooting

### Email Not Working
1. Check `GMAIL_APP_PASSWORD` is set correctly
2. Verify 2FA is enabled on Gmail
3. Check Gmail account is not locked
4. Ensure app password is for "Mail" service

### SMS Not Working
1. Check Twilio credentials are correct
2. Verify Twilio account is active
3. Ensure phone number is purchased/active
4. Check account has sufficient credits

### Both Systems Down
1. Verify `.env` file exists in `node-api/` directory
2. Check environment variables are loaded
3. Restart the Node.js server after changes
4. Check console logs for specific error messages
