# Klarna Integration Guide

This document explains how Klarna has been integrated into the Marisail application alongside Apple Pay, Google Pay, Alipay, and WeChat Pay.

## Overview

Klarna has been integrated using Stripe's Klarna support, providing flexible "buy now, pay later" payment options for customers. Klarna is popular in Europe and North America, offering customers the ability to pay immediately, pay later, or split payments into installments.

## Features

- ✅ Klarna button with flexible payment options
- ✅ Automatic payment processing through Stripe
- ✅ Integration with existing payment modal
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Cross-platform support (Web, Mobile)
- ✅ Support for multiple currencies
- ✅ Buy now, pay later functionality
- ✅ Interest-free installment options

## Backend Integration

### New Endpoints

#### `POST /api/payment/create-klarna-intent`
Creates a payment intent specifically for Klarna transactions.

**Request Body:**
```json
{
  "amount": 29.99,
  "currency": "usd",
  "metadata": {
    "userId": "user123",
    "paymentType": "klarna",
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
Now includes Klarna as a supported payment method type alongside Apple Pay, Google Pay, Alipay, WeChat Pay, and credit cards.

## Frontend Integration

### Components

#### `KlarnaButton.jsx`
A dedicated component for Klarna payments with:
- Secure payment processing with redirect flow
- Custom Klarna styling with pink gradient (Klarna brand colors)
- Loading states and error handling
- Always available (no device detection needed)
- Redirect-based payment flow

#### `PaymentModal.jsx`
Updated to include Klarna as a payment option with:
- Klarna-specific UI with Klarna logo
- Integration with the KlarnaButton component
- Proper error handling and user guidance
- Clear explanation of Klarna benefits
- Payment options information

#### `PaymentButton.jsx`
Enhanced to show Klarna button alongside other payment methods:
- Automatic Klarna button display
- Fallback to traditional payment methods
- Configurable Klarna visibility

## Setup Requirements

### 1. Stripe Configuration

Ensure your Stripe account has Klarna enabled:

1. Log into your Stripe Dashboard
2. Navigate to Settings > Payment methods
3. Enable Klarna
4. Configure your Klarna settings

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

Configure the return URL for Klarna payments:

1. Set up a success page at `/payment-success`
2. Handle the payment confirmation on return
3. Update order status based on payment result

### 4. HTTPS Requirement

Klarna requires HTTPS in production. Ensure your application is served over HTTPS.

## Usage Examples

### Basic Klarna Button

```jsx
import KlarnaButton from './components/KlarnaButton';

<KlarnaButton
  amount={29.99}
  onSuccess={() => console.log('Payment successful!')}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

### Payment Modal with Klarna

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
  onSuccess={() => console.log('Payment successful!')}
/>
```

## Payment Flow

### Klarna Payment Process

1. **User clicks Klarna button**
2. **Payment intent created** on backend
3. **User redirected** to Klarna payment page
4. **User selects payment option** (pay now, pay later, or installments)
5. **User completes payment** on Klarna
6. **User redirected back** to your application
7. **Payment confirmed** and order updated

### Redirect Flow

```javascript
// Klarna uses redirect-based payment flow
const { error } = await stripe.confirmKlarnaPayment(
  clientSecret,
  {
    return_url: `${window.location.origin}/payment-success`,
  }
);
```

## Klarna Payment Options

### Pay Now
- Immediate payment with credit/debit card
- No additional fees
- Instant confirmation

### Pay Later
- Pay within 30 days
- No interest or fees
- Email reminders before due date

### Installments
- Split payment into 4 equal installments
- Interest-free
- Automatic payments every 2 weeks

## Supported Currencies

Klarna supports multiple currencies through Stripe:

- **USD** (US Dollar)
- **EUR** (Euro)
- **GBP** (British Pound)
- **SEK** (Swedish Krona)
- **NOK** (Norwegian Krone)
- **DKK** (Danish Krone)
- **CHF** (Swiss Franc)
- **AUD** (Australian Dollar)
- **CAD** (Canadian Dollar)

## Regional Support

Klarna is primarily used in:
- **United States**
- **United Kingdom**
- **Germany**
- **Sweden**
- **Norway**
- **Denmark**
- **Netherlands**
- **Austria**
- **Belgium**
- **Finland**
- **Australia**
- **Canada**

## Browser Support

Klarna works on:
- Chrome (all platforms)
- Safari (macOS, iOS)
- Firefox (all platforms)
- Edge (all platforms)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

1. **HTTPS Required**: Always use HTTPS in production
2. **Domain Verification**: Verify your domain with Stripe
3. **Validation**: All payments are validated on the backend
4. **Error Handling**: Comprehensive error handling for failed payments
5. **User Privacy**: Klarna transactions don't expose card details
6. **Tokenization**: Payment information is tokenized for security
7. **PCI Compliance**: Klarna handles PCI compliance requirements

## Testing

### Test Environment

1. Use Stripe test keys
2. Test redirect flow
3. Verify return URL handling
4. Test error scenarios
5. Test on mobile devices

### Test Cards

Use Stripe's test cards for Klarna testing:
- Test payments will redirect to Stripe's test page
- No actual Klarna account required for testing

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

1. **Klarna not showing**: Check Stripe configuration and Klarna enablement
2. **Payment fails**: Verify Stripe keys and Klarna configuration
3. **Redirect issues**: Check return URL configuration
4. **Button not styled**: Check CSS classes and Tailwind configuration
5. **Cross-browser issues**: Test on multiple browsers

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Performance Considerations

- Klarna buttons are always rendered (no availability detection needed)
- Redirect-based payment flow
- Minimal bundle size impact
- Fast payment processing

## Analytics and Tracking

Track Klarna usage:
```javascript
// Track Klarna button clicks
analytics.track('klarna_button_clicked', {
  amount: 29.99,
  currency: 'usd'
});

// Track successful payments
analytics.track('klarna_payment_success', {
  amount: 29.99,
  payment_intent_id: 'pi_xxx'
});
```

## Future Enhancements

- [ ] Afterpay integration
- [ ] Sezzle integration
- [ ] Enhanced error messages
- [ ] Payment analytics dashboard
- [ ] Recurring payments support
- [ ] Multi-currency support
- [ ] Payment method preferences

## Support

For issues related to Klarna integration:
1. Check Stripe Dashboard for Klarna status
2. Verify domain configuration
3. Test redirect flow
4. Review browser console for errors
5. Check backend logs for payment intent creation

## Resources

- [Stripe Klarna Documentation](https://stripe.com/docs/klarna)
- [Klarna Developer Documentation](https://developers.klarna.com/)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Klarna Brand Guidelines](https://www.klarna.com/brand-guidelines)

## Comparison with Other Payment Methods

| Feature | Apple Pay | Google Pay | Alipay | WeChat Pay | Klarna |
|---------|----------|-----------|---------|------------|--------|
| **Platform** | iOS/macOS | Android/Web | Web/Mobile | Web/Mobile | Web/Mobile |
| **Authentication** | Touch ID/Face ID | Google Account | Alipay Account | WeChat Account | Klarna Account |
| **Flow** | In-app | In-app | Redirect | Redirect | Redirect |
| **Availability** | Device-dependent | Device-dependent | Always available | Always available | Always available |
| **Regional Focus** | Global | Global | Asia-focused | China-focused | Europe/North America |
| **Payment Options** | Immediate | Immediate | Immediate | Immediate | Flexible (Now/Later/Installments) |
| **Currency Support** | Multiple | Multiple | Multiple | Multiple | Multiple |

## Klarna Benefits

### For Customers
- **Flexibility**: Choose when to pay
- **No Interest**: Interest-free payment options
- **No Fees**: No hidden fees or charges
- **Easy Approval**: Quick and easy approval process
- **Mobile Friendly**: Optimized for mobile devices

### For Merchants
- **Higher Conversion**: Increased checkout completion rates
- **Lower Cart Abandonment**: Flexible payment options reduce abandonment
- **Global Reach**: Available in multiple countries
- **Easy Integration**: Simple integration with Stripe
- **Risk Management**: Klarna handles fraud protection

## Best Practices

1. **Clear Communication**: Explain Klarna benefits to customers
2. **Mobile Optimization**: Ensure mobile-friendly experience
3. **Trust Signals**: Display security badges and trust indicators
4. **Testing**: Test thoroughly across different devices and browsers
5. **Analytics**: Track conversion rates and payment method preferences
6. **Customer Support**: Provide clear information about Klarna payment options

## Integration Checklist

- [ ] Stripe account configured with Klarna enabled
- [ ] Environment variables set up
- [ ] Return URL configured
- [ ] HTTPS enabled in production
- [ ] Payment success page created
- [ ] Error handling implemented
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified
- [ ] Analytics tracking implemented
- [ ] Customer support documentation updated
