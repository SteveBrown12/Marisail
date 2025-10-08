# WeChat Pay Integration Guide

This document explains how WeChat Pay has been integrated into the Marisail application alongside Apple Pay, Google Pay, and Alipay.

## Overview

WeChat Pay has been integrated using Stripe's WeChat Pay support, providing a secure payment experience for Chinese and international users. WeChat Pay is one of the most popular payment methods in China and is widely used by WeChat users worldwide.

## Features

- ✅ WeChat Pay button with secure redirect flow
- ✅ Automatic payment processing through Stripe
- ✅ Integration with existing payment modal
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Cross-platform support (Web, Mobile)
- ✅ Support for multiple currencies

## Backend Integration

### New Endpoints

#### `POST /api/payment/create-wechat-pay-intent`
Creates a payment intent specifically for WeChat Pay transactions.

**Request Body:**
```json
{
  "amount": 29.99,
  "currency": "usd",
  "metadata": {
    "userId": "user123",
    "paymentType": "wechat_pay",
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
Now includes WeChat Pay as a supported payment method type alongside Apple Pay, Google Pay, Alipay, and credit cards.

## Frontend Integration

### Components

#### `WeChatPayButton.jsx`
A dedicated component for WeChat Pay payments with:
- Secure payment processing with redirect flow
- Custom WeChat Pay styling with green gradient (WeChat brand colors)
- Loading states and error handling
- Always available (no device detection needed)
- Redirect-based payment flow

#### `PaymentModal.jsx`
Updated to include WeChat Pay as a payment option with:
- WeChat Pay-specific UI with WeChat logo
- Integration with the WeChatPayButton component
- Proper error handling and user guidance
- Clear redirect flow explanation

#### `PaymentButton.jsx`
Enhanced to show WeChat Pay button alongside other payment methods:
- Automatic WeChat Pay button display
- Fallback to traditional payment methods
- Configurable WeChat Pay visibility

## Setup Requirements

### 1. Stripe Configuration

Ensure your Stripe account has WeChat Pay enabled:

1. Log into your Stripe Dashboard
2. Navigate to Settings > Payment methods
3. Enable WeChat Pay
4. Configure your WeChat Pay settings

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

Configure the return URL for WeChat Pay payments:

1. Set up a success page at `/payment-success`
2. Handle the payment confirmation on return
3. Update order status based on payment result

### 4. HTTPS Requirement

WeChat Pay requires HTTPS in production. Ensure your application is served over HTTPS.

## Usage Examples

### Basic WeChat Pay Button

```jsx
import WeChatPayButton from './components/WeChatPayButton';

<WeChatPayButton
  amount={29.99}
  onSuccess={() => console.log('Payment successful!')}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

### Payment Modal with WeChat Pay

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

### Enhanced Payment Button with All Digital Wallets

```jsx
import PaymentButton from './components/PaymentButton';

<PaymentButton
  amount={29.99}
  type="service"
  showApplePay={true}
  showGooglePay={true}
  showAlipay={true}
  showWeChatPay={true}
  onSuccess={() => console.log('Payment successful!')}
/>
```

## Payment Flow

### WeChat Pay Payment Process

1. **User clicks WeChat Pay button**
2. **Payment intent created** on backend
3. **User redirected** to WeChat Pay payment page
4. **User completes payment** on WeChat Pay
5. **User redirected back** to your application
6. **Payment confirmed** and order updated

### Redirect Flow

```javascript
// WeChat Pay uses redirect-based payment flow
const { error } = await stripe.confirmWeChatPayPayment(
  clientSecret,
  {
    return_url: `${window.location.origin}/payment-success`,
  }
);
```

## Supported Currencies

WeChat Pay supports multiple currencies through Stripe:

- **USD** (US Dollar)
- **CNY** (Chinese Yuan)
- **EUR** (Euro)
- **GBP** (British Pound)
- **JPY** (Japanese Yen)
- **HKD** (Hong Kong Dollar)
- **SGD** (Singapore Dollar)
- **AUD** (Australian Dollar)
- **CAD** (Canadian Dollar)

## Regional Support

WeChat Pay is primarily used in:
- **China** (Mainland China)
- **Hong Kong**
- **Singapore**
- **Malaysia**
- **Thailand**
- **Philippines**
- **Indonesia**
- **Other Asian markets**
- **Chinese diaspora worldwide**

## Browser Support

WeChat Pay works on:
- Chrome (all platforms)
- Safari (macOS, iOS)
- Firefox (all platforms)
- Edge (all platforms)
- Mobile browsers (iOS Safari, Chrome Mobile)
- WeChat browser (in-app)

## Security Considerations

1. **HTTPS Required**: Always use HTTPS in production
2. **Domain Verification**: Verify your domain with Stripe
3. **Validation**: All payments are validated on the backend
4. **Error Handling**: Comprehensive error handling for failed payments
5. **User Privacy**: WeChat Pay transactions don't expose card details
6. **Tokenization**: Payment information is tokenized for security

## Testing

### Test Environment

1. Use Stripe test keys
2. Test redirect flow
3. Verify return URL handling
4. Test error scenarios
5. Test on mobile devices

### Test Cards

Use Stripe's test cards for WeChat Pay testing:
- Test payments will redirect to Stripe's test page
- No actual WeChat Pay account required for testing

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

1. **WeChat Pay not showing**: Check Stripe configuration and WeChat Pay enablement
2. **Payment fails**: Verify Stripe keys and WeChat Pay configuration
3. **Redirect issues**: Check return URL configuration
4. **Button not styled**: Check CSS classes and Tailwind configuration
5. **Cross-browser issues**: Test on multiple browsers

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Performance Considerations

- WeChat Pay buttons are always rendered (no availability detection needed)
- Redirect-based payment flow
- Minimal bundle size impact
- Fast payment processing

## Analytics and Tracking

Track WeChat Pay usage:
```javascript
// Track WeChat Pay button clicks
analytics.track('wechat_pay_button_clicked', {
  amount: 29.99,
  currency: 'usd'
});

// Track successful payments
analytics.track('wechat_pay_payment_success', {
  amount: 29.99,
  payment_intent_id: 'pi_xxx'
});
```

## Future Enhancements

- [ ] UnionPay integration
- [ ] Enhanced error messages
- [ ] Payment analytics dashboard
- [ ] Recurring payments support
- [ ] Multi-currency support
- [ ] Payment method preferences

## Support

For issues related to WeChat Pay integration:
1. Check Stripe Dashboard for WeChat Pay status
2. Verify domain configuration
3. Test redirect flow
4. Review browser console for errors
5. Check backend logs for payment intent creation

## Resources

- [Stripe WeChat Pay Documentation](https://stripe.com/docs/wechat-pay)
- [WeChat Pay Developer Documentation](https://pay.weixin.qq.com/)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [WeChat Pay Brand Guidelines](https://pay.weixin.qq.com/wiki/doc/apiv3/open/pay/chapter2_1.shtml)

## Comparison with Other Payment Methods

| Feature | Apple Pay | Google Pay | Alipay | WeChat Pay |
|---------|----------|-----------|---------|------------|
| **Platform** | iOS/macOS | Android/Web | Web/Mobile | Web/Mobile |
| **Authentication** | Touch ID/Face ID | Google Account | Alipay Account | WeChat Account |
| **Flow** | In-app | In-app | Redirect | Redirect |
| **Availability** | Device-dependent | Device-dependent | Always available | Always available |
| **Regional Focus** | Global | Global | Asia-focused | China-focused |
| **Currency Support** | Multiple | Multiple | Multiple | Multiple |

## WeChat Pay vs Alipay

### Similarities
- Both are popular in China and Asia
- Both use redirect-based payment flow
- Both support multiple currencies
- Both require HTTPS in production

### Differences
- **WeChat Pay**: More popular among WeChat users, integrated with WeChat ecosystem
- **Alipay**: More established, broader merchant acceptance, stronger in e-commerce
- **User Base**: WeChat Pay users are typically more mobile-first
- **Integration**: WeChat Pay is more tightly integrated with WeChat app features

## Best Practices

1. **Offer Both**: Consider offering both Alipay and WeChat Pay for Chinese users
2. **Mobile Optimization**: Optimize for mobile experience as most users are mobile
3. **Localization**: Provide Chinese language support for better user experience
4. **Testing**: Test thoroughly on mobile devices and WeChat browser
5. **Analytics**: Track usage patterns to optimize payment flow
