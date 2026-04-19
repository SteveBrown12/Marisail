# Flutterwave Integration Guide

This document explains how Flutterwave has been integrated into the Marisail application alongside Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna, and Razorpay.

## Overview

Flutterwave has been integrated using Stripe's Flutterwave support, providing comprehensive payment solutions for African and emerging markets. Flutterwave is one of the leading payment gateways in Africa, offering multiple payment methods including cards, mobile money, bank transfers, and USSD payments.

## Features

- ✅ Flutterwave button with comprehensive payment options
- ✅ Automatic payment processing through Stripe
- ✅ Integration with existing payment modal
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Cross-platform support (Web, Mobile)
- ✅ Support for multiple currencies
- ✅ Multiple African payment methods
- ✅ Mobile money integration
- ✅ USSD payment support

## Backend Integration

### New Endpoints

#### `POST /api/payment/create-flutterwave-intent`
Creates a payment intent specifically for Flutterwave transactions.

**Request Body:**
```json
{
  "amount": 29.99,
  "currency": "usd",
  "metadata": {
    "userId": "user123",
    "paymentType": "flutterwave",
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
Now includes Flutterwave as a supported payment method type alongside Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna, Razorpay, and credit cards.

## Frontend Integration

### Components

#### `FlutterwaveButton.jsx`
A dedicated component for Flutterwave payments with:
- Secure payment processing with redirect flow
- Custom Flutterwave styling with orange gradient (Flutterwave brand colors)
- Loading states and error handling
- Always available (no device detection needed)
- Redirect-based payment flow

#### `PaymentModal.jsx`
Updated to include Flutterwave as a payment option with:
- Flutterwave-specific UI with Flutterwave logo
- Integration with the FlutterwaveButton component
- Proper error handling and user guidance
- Clear explanation of Flutterwave benefits and payment methods

#### `PaymentButton.jsx`
Enhanced to show Flutterwave button alongside other payment methods:
- Automatic Flutterwave button display
- Fallback to traditional payment methods
- Configurable Flutterwave visibility

## Setup Requirements

### 1. Stripe Configuration

Ensure your Stripe account has Flutterwave enabled:

1. Log into your Stripe Dashboard
2. Navigate to Settings > Payment methods
3. Enable Flutterwave
4. Configure your Flutterwave settings

### 2. Environment Variables

Make sure these environment variables are set:

```env
# Backend
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 3. Return URL Configuration

Configure the return URL for Flutterwave payments:

1. Set up a success page at `/payment-success`
2. Handle the payment confirmation on return
3. Update order status based on payment result

### 4. HTTPS Requirement

Flutterwave requires HTTPS in production. Ensure your application is served over HTTPS.

## Usage Examples

### Basic Flutterwave Button

```jsx
import FlutterwaveButton from './components/FlutterwaveButton';

<FlutterwaveButton
  amount={29.99}
  onSuccess={() => console.log('Payment successful!')}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

### Payment Modal with Flutterwave

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

### Enhanced Payment Button with All Payment Methods

```jsx
import PaymentButton from './components/PaymentButton';

<PaymentButton
  amount={29.99}
  type="service"
  showApplePay={true}
  showGooglePay={true}
  showAlipay={true}
  showWeChatPay={true}
  showKlarna={true}
  showRazorpay={true}
  showFlutterwave={true}
  onSuccess={() => console.log('Payment successful!')}
/>
```

## Payment Flow

### Flutterwave Payment Process

1. **User clicks Flutterwave button**
2. **Payment intent created** on backend
3. **User redirected** to Flutterwave payment page
4. **User selects payment method** (cards, mobile money, bank transfer, USSD)
5. **User completes payment** on Flutterwave
6. **User redirected back** to your application
7. **Payment confirmed** and order updated

### Redirect Flow

```javascript
// Flutterwave uses redirect-based payment flow
const { error } = await stripe.confirmFlutterwavePayment(
  clientSecret,
  {
    return_url: `${window.location.origin}/payment-success`,
  }
);
```

## Flutterwave Payment Methods

### Credit/Debit Cards
- Visa, Mastercard, American Express
- International cards
- Local African cards
- Secure card processing

### Mobile Money
- MTN Mobile Money
- Airtel Money
- Orange Money
- Vodafone Cash
- Other mobile money providers

### Bank Transfer
- Direct bank transfers
- Real-time bank processing
- Multiple African banks
- Secure authentication

### USSD Payments
- *144# payments
- *170# payments
- Other USSD codes
- No internet required

### Other Methods
- Bank account debits
- QR code payments
- Cryptocurrency payments

## Supported Currencies

Flutterwave supports multiple currencies through Stripe:

- **NGN** (Nigerian Naira)
- **KES** (Kenyan Shilling)
- **GHS** (Ghanaian Cedi)
- **UGX** (Ugandan Shilling)
- **TZS** (Tanzanian Shilling)
- **ZAR** (South African Rand)
- **EGP** (Egyptian Pound)
- **MAD** (Moroccan Dirham)
- **USD** (US Dollar)
- **EUR** (Euro)
- **GBP** (British Pound)

## Regional Support

Flutterwave is primarily used in:
- **Nigeria** (Primary market)
- **Kenya**
- **Ghana**
- **Uganda**
- **Tanzania**
- **South Africa**
- **Egypt**
- **Morocco**
- **Rwanda**
- **Zambia**
- **Other African countries**

## Browser Support

Flutterwave works on:
- Chrome (all platforms)
- Safari (macOS, iOS)
- Firefox (all platforms)
- Edge (all platforms)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web Apps (PWA)

## Security Considerations

1. **HTTPS Required**: Always use HTTPS in production
2. **Domain Verification**: Verify your domain with Stripe
3. **Validation**: All payments are validated on the backend
4. **Error Handling**: Comprehensive error handling for failed payments
5. **User Privacy**: Flutterwave transactions don't expose card details
6. **Tokenization**: Payment information is tokenized for security
7. **PCI Compliance**: Flutterwave handles PCI compliance requirements
8. **Fraud Protection**: Advanced fraud detection and prevention

## Testing

### Test Environment

1. Use Stripe test keys
2. Test redirect flow
3. Verify return URL handling
4. Test error scenarios
5. Test on mobile devices

### Test Cards

Use Stripe's test cards for Flutterwave testing:
- Test payments will redirect to Stripe's test page
- No actual Flutterwave account required for testing

## Payment Success Handling

### Return URL Setup

Create a payment success page:

```jsx
// pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('processing');

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    
    if (paymentIntentId && paymentIntentClientSecret) {
      // Verify payment status with backend
      verifyPayment(paymentIntentId);
    }
  }, [searchParams]);

  const verifyPayment = async (paymentIntentId) => {
    try {
      const response = await fetch(`/api/payment/verify/${paymentIntentId}`);
      const data = await response.json();
      
      if (data.status === 'succeeded') {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {paymentStatus === 'success' && (
          <div className="text-green-600">
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p>Your payment has been processed successfully.</p>
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div className="text-red-600">
            <h1 className="text-2xl font-bold">Payment Failed</h1>
            <p>Your payment could not be processed.</p>
          </div>
        )}
        {paymentStatus === 'processing' && (
          <div className="text-blue-600">
            <h1 className="text-2xl font-bold">Processing Payment...</h1>
            <p>Please wait while we verify your payment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
```

## Troubleshooting

### Common Issues

1. **Flutterwave not showing**: Check Stripe configuration and Flutterwave enablement
2. **Payment fails**: Verify Stripe keys and Flutterwave configuration
3. **Redirect issues**: Check return URL configuration
4. **Button not styled**: Check CSS classes and Tailwind configuration
5. **Cross-browser issues**: Test on multiple browsers

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Performance Considerations

- Flutterwave buttons are always rendered (no availability detection needed)
- Redirect-based payment flow
- Minimal bundle size impact
- Fast payment processing

## Analytics and Tracking

Track Flutterwave usage:
```javascript
// Track Flutterwave button clicks
analytics.track('flutterwave_button_clicked', {
  amount: 29.99,
  currency: 'usd'
});

// Track successful payments
analytics.track('flutterwave_payment_success', {
  amount: 29.99,
  payment_intent_id: 'pi_xxx'
});
```

## Future Enhancements

- [ ] Paystack integration
- [ ] Interswitch integration
- [ ] Enhanced error messages
- [ ] Payment analytics dashboard
- [ ] Recurring payments support
- [ ] Multi-currency support
- [ ] Payment method preferences

## Support

For issues related to Flutterwave integration:
1. Check Stripe Dashboard for Flutterwave status
2. Verify domain configuration
3. Test redirect flow
4. Review browser console for errors
5. Check backend logs for payment intent creation

## Resources

- [Stripe Flutterwave Documentation](https://stripe.com/docs/flutterwave)
- [Flutterwave Developer Documentation](https://developer.flutterwave.com/)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Flutterwave Brand Guidelines](https://flutterwave.com/brand-assets)

## Comparison with Other Payment Methods

| Feature | Apple Pay | Google Pay | Alipay | WeChat Pay | Klarna | Razorpay | Flutterwave |
|---------|----------|-----------|---------|------------|--------|----------|-------------|
| **Platform** | iOS/macOS | Android/Web | Web/Mobile | Web/Mobile | Web/Mobile | Web/Mobile | Web/Mobile |
| **Authentication** | Touch ID/Face ID | Google Account | Alipay Account | WeChat Account | Klarna Account | Razorpay Account | Flutterwave Account |
| **Flow** | In-app | In-app | Redirect | Redirect | Redirect | Redirect | Redirect |
| **Availability** | Device-dependent | Device-dependent | Always available | Always available | Always available | Always available | Always available |
| **Regional Focus** | Global | Global | Asia-focused | China-focused | Europe/North America | India-focused | Africa-focused |
| **Payment Options** | Immediate | Immediate | Immediate | Immediate | Flexible (Now/Later/Installments) | Multiple (Cards/UPI/Wallets) | Multiple (Cards/Mobile Money/USSD) |
| **Currency Support** | Multiple | Multiple | Multiple | Multiple | Multiple | Multiple | Multiple |

## Flutterwave Benefits

### For Customers
- **Multiple Payment Methods**: Cards, mobile money, bank transfers, USSD
- **Mobile Money Integration**: Easy mobile money payments
- **USSD Support**: Payments without internet
- **Local Currency Support**: Pay in local African currencies
- **Mobile Optimized**: Great mobile experience

### For Merchants
- **Higher Conversion**: Multiple payment options increase conversions
- **Lower Cart Abandonment**: Easy payment methods reduce abandonment
- **African Market Focus**: Strong presence in African markets
- **Easy Integration**: Simple integration with Stripe
- **Comprehensive Analytics**: Detailed payment analytics

## Best Practices

1. **Multiple Payment Options**: Offer various payment methods for African users
2. **Mobile Optimization**: Ensure mobile-friendly experience
3. **Mobile Money Promotion**: Highlight mobile money as a preferred payment method
4. **Trust Signals**: Display security badges and trust indicators
5. **Testing**: Test thoroughly across different devices and browsers
6. **Analytics**: Track conversion rates and payment method preferences

## Integration Checklist

- [ ] Stripe account configured with Flutterwave enabled
- [ ] Environment variables set up
- [ ] Return URL configured
- [ ] HTTPS enabled in production
- [ ] Payment success page created
- [ ] Error handling implemented
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified
- [ ] Analytics tracking implemented
- [ ] Customer support documentation updated
