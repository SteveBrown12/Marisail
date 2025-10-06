# Google Pay Integration Guide

This document explains how Google Pay has been integrated into the Marisail application alongside Apple Pay.

## Overview

Google Pay has been integrated using Stripe's Google Pay support, providing a secure and seamless payment experience for Android and web users.

## Features

- ✅ Google Pay button with Google account authentication
- ✅ Automatic availability detection
- ✅ Secure payment processing through Stripe
- ✅ Integration with existing payment modal
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Cross-platform support (Android, Chrome, Edge, Safari)

## Backend Integration

### New Endpoints

#### `POST /api/payment/create-google-pay-intent`
Creates a payment intent specifically for Google Pay transactions.

**Request Body:**
```json
{
  "amount": 29.99,
  "currency": "usd",
  "metadata": {
    "userId": "user123",
    "paymentType": "google_pay",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### Updated Endpoints

#### `POST /api/payment/create-payment-intent`
Now includes Google Pay as a supported payment method type alongside Apple Pay and credit cards.

## Frontend Integration

### Components

#### `GooglePayButton.jsx`
A dedicated component for Google Pay payments with:
- Automatic Google Pay availability detection
- Secure payment processing
- Loading states and error handling
- Custom Google Pay styling with gradient background
- Only renders when Google Pay is available

#### `PaymentModal.jsx`
Updated to include Google Pay as the second payment option with:
- Google Pay-specific UI with Google logo
- Integration with the GooglePayButton component
- Proper error handling

#### `PaymentButton.jsx`
Enhanced to show both Apple Pay and Google Pay buttons when available:
- Automatic Google Pay button display
- Fallback to traditional payment methods
- Configurable Google Pay visibility

## Setup Requirements

### 1. Stripe Configuration

Ensure your Stripe account has Google Pay enabled:

1. Log into your Stripe Dashboard
2. Navigate to Settings > Payment methods
3. Enable Google Pay
4. Configure your Google Pay domains

### 2. Environment Variables

Make sure these environment variables are set:

```env
# Backend
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 3. Google Pay Domain Verification

Add your domain to Google Pay in Stripe Dashboard:
1. Go to Settings > Payment methods > Google Pay
2. Add your domain (e.g., `marisail.com`)
3. Verify domain ownership

### 4. HTTPS Requirement

Google Pay requires HTTPS in production. Ensure your application is served over HTTPS.

## Usage Examples

### Basic Google Pay Button

```jsx
import GooglePayButton from './components/GooglePayButton';

<GooglePayButton
  amount={29.99}
  onSuccess={() => console.log('Payment successful!')}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

### Payment Modal with Google Pay

```jsx
import PaymentModal from './components/PaymentModal';

<PaymentModal
  isOpen={true}
  onClose={() => setModalOpen(false)}
  amount={29.99}
  onSuccess={(paymentIntent) => {
    console.log('Payment completed:', paymentIntent);
  }}
/>
```

### Enhanced Payment Button with Both Apple Pay and Google Pay

```jsx
import PaymentButton from './components/PaymentButton';

<PaymentButton
  amount={29.99}
  type="service"
  showApplePay={true}
  showGooglePay={true}
  onSuccess={() => console.log('Payment successful!')}
/>
```

## Browser Support

Google Pay is supported on:
- Chrome on Android (Android 4.4+)
- Chrome on desktop (Windows, macOS, Linux)
- Edge on desktop (Windows, macOS)
- Safari on macOS (macOS Sierra 10.12.4+)
- Firefox on desktop (Windows, macOS, Linux)

The component automatically detects availability and only shows the Google Pay button when supported.

## Platform-Specific Features

### Android
- Native Google Pay integration
- Fingerprint authentication
- PIN authentication
- Biometric authentication

### Web
- Google account authentication
- Saved payment methods
- Address autofill
- Shipping information

## Security Considerations

1. **Domain Verification**: Always verify your domain with Google Pay
2. **HTTPS**: Use HTTPS in production
3. **Validation**: All payments are validated on the backend
4. **Error Handling**: Comprehensive error handling for failed payments
5. **User Privacy**: Google Pay transactions don't expose card details
6. **Tokenization**: Payment information is tokenized for security

## Testing

### Test Cards

Use Stripe's test cards for Google Pay testing:
- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- American Express: 3782 822463 10005

### Test Environment

1. Use Stripe test keys
2. Test on actual Android devices
3. Test on desktop browsers
4. Verify Google account integration
5. Test error scenarios

## Payment Flow Comparison

### Apple Pay Flow
1. User clicks Apple Pay button
2. Touch ID/Face ID authentication
3. Payment processed through Stripe
4. Success/failure callback

### Google Pay Flow
1. User clicks Google Pay button
2. Google account authentication
3. Payment method selection
4. Payment processed through Stripe
5. Success/failure callback

## Troubleshooting

### Common Issues

1. **Google Pay not showing**: Check domain verification and HTTPS
2. **Payment fails**: Verify Stripe keys and Google Pay configuration
3. **Authentication issues**: Ensure Google account is properly set up
4. **Button not styled**: Check CSS classes and Tailwind configuration
5. **Cross-browser issues**: Test on multiple browsers and devices

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Performance Considerations

- Google Pay buttons are only rendered when available
- Lazy loading of Google Pay SDK
- Minimal bundle size impact
- Fast payment processing

## Analytics and Tracking

Track Google Pay usage:
```javascript
// Track Google Pay button clicks
analytics.track('google_pay_button_clicked', {
  amount: 29.99,
  currency: 'usd'
});

// Track successful payments
analytics.track('google_pay_payment_success', {
  amount: 29.99,
  payment_intent_id: 'pi_xxx'
});
```

## Future Enhancements

- [ ] Samsung Pay integration
- [ ] Enhanced error messages
- [ ] Payment analytics dashboard
- [ ] Recurring payments support
- [ ] Multi-currency support
- [ ] Payment method preferences

## Support

For issues related to Google Pay integration:
1. Check Stripe Dashboard for Google Pay status
2. Verify domain configuration
3. Test on multiple devices and browsers
4. Review browser console for errors
5. Check backend logs for payment intent creation

## Resources

- [Stripe Google Pay Documentation](https://stripe.com/docs/google-pay)
- [Google Pay Web Integration Guide](https://developers.google.com/pay/api/web)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Google Pay Brand Guidelines](https://developers.google.com/pay/api/web/guides/brand-guidelines)
