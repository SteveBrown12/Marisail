# Digital Wallet Integration Guide (Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna, Razorpay & Flutterwave)

This document explains how Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna, Razorpay, and Flutterwave have been integrated into the Marisail application.

## Overview

Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna, Razorpay, and Flutterwave have been integrated using Stripe's digital wallet support, providing secure and seamless payment experiences across all platforms:

- **Apple Pay**: For iOS and macOS users with Touch ID/Face ID
- **Google Pay**: For Android and web users with Google account authentication
- **Alipay**: For Chinese and Asian market users with Alipay account authentication
- **WeChat Pay**: For WeChat users worldwide with WeChat account authentication
- **Klarna**: For flexible "buy now, pay later" payment options in Europe and North America
- **Razorpay**: For comprehensive payment solutions in India and Southeast Asia
- **Flutterwave**: For comprehensive payment solutions in Africa and emerging markets

## Features

- ✅ Apple Pay button with Touch ID/Face ID authentication
- ✅ Automatic availability detection
- ✅ Secure payment processing through Stripe
- ✅ Integration with existing payment modal
- ✅ Error handling and user feedback
- ✅ Responsive design

## Backend Integration

### New Endpoints

#### `POST /api/payment/create-apple-pay-intent`
Creates a payment intent specifically for Apple Pay transactions.

**Request Body:**
```json
{
  "amount": 29.99,
  "currency": "usd",
  "metadata": {
    "userId": "user123",
    "paymentType": "apple_pay",
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
Now includes Apple Pay as a supported payment method type.

## Frontend Integration

### Components

#### `ApplePayButton.jsx`
A dedicated component for Apple Pay payments with:
- Automatic Apple Pay availability detection
- Secure payment processing
- Loading states and error handling
- Customizable styling

#### `PaymentModal.jsx`
Updated to include Apple Pay as the first payment option with:
- Apple Pay-specific UI
- Integration with the ApplePayButton component
- Proper error handling

#### `PaymentButton.jsx`
Enhanced to show Apple Pay button when available:
- Automatic Apple Pay button display
- Fallback to traditional payment methods
- Configurable Apple Pay visibility

## Setup Requirements

### 1. Stripe Configuration

Ensure your Stripe account has Apple Pay enabled:

1. Log into your Stripe Dashboard
2. Navigate to Settings > Payment methods
3. Enable Apple Pay
4. Configure your Apple Pay domains

### 2. Environment Variables

Make sure these environment variables are set:

```env
# Backend
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 3. Apple Pay Domain Verification

Add your domain to Apple Pay in Stripe Dashboard:
1. Go to Settings > Payment methods > Apple Pay
2. Add your domain (e.g., `marisail.com`)
3. Download the verification file
4. Upload it to your domain's root

### 4. HTTPS Requirement

Apple Pay requires HTTPS in production. Ensure your application is served over HTTPS.

## Usage Examples

### Basic Apple Pay Button

```jsx
import ApplePayButton from './components/ApplePayButton';

<ApplePayButton
  amount={29.99}
  onSuccess={() => console.log('Payment successful!')}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

### Payment Modal with Apple Pay

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

### Enhanced Payment Button

```jsx
import PaymentButton from './components/PaymentButton';

<PaymentButton
  amount={29.99}
  type="service"
  showApplePay={true}
  onSuccess={() => console.log('Payment successful!')}
/>
```

## Browser Support

Apple Pay is supported on:
- Safari on macOS (macOS Sierra 10.12.4+)
- Safari on iOS (iOS 10.1+)
- Chrome on macOS (with Apple Pay enabled)
- Edge on macOS (with Apple Pay enabled)

The component automatically detects availability and only shows the Apple Pay button when supported.

## Security Considerations

1. **Domain Verification**: Always verify your domain with Apple Pay
2. **HTTPS**: Use HTTPS in production
3. **Validation**: All payments are validated on the backend
4. **Error Handling**: Comprehensive error handling for failed payments
5. **User Privacy**: Apple Pay transactions don't expose card details

## Testing

### Test Cards

Use Stripe's test cards for Apple Pay testing:
- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- American Express: 3782 822463 10005

### Test Environment

1. Use Stripe test keys
2. Test on actual iOS/macOS devices
3. Verify Touch ID/Face ID integration
4. Test error scenarios

## Troubleshooting

### Common Issues

1. **Apple Pay not showing**: Check domain verification and HTTPS
2. **Payment fails**: Verify Stripe keys and Apple Pay configuration
3. **Touch ID not working**: Ensure device has Touch ID/Face ID enabled
4. **Button not styled**: Check CSS classes and Tailwind configuration

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Future Enhancements

- [ ] Google Pay integration
- [ ] Samsung Pay integration
- [ ] Enhanced error messages
- [ ] Payment analytics
- [ ] Recurring payments support

## Support

For issues related to Apple Pay integration:
1. Check Stripe Dashboard for Apple Pay status
2. Verify domain configuration
3. Test on multiple devices
4. Review browser console for errors
5. Check backend logs for payment intent creation

## Resources

- [Stripe Apple Pay Documentation](https://stripe.com/docs/apple-pay)
- [Apple Pay Web Integration Guide](https://developer.apple.com/documentation/apple_pay_on_the_web)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
