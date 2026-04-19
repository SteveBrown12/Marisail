# Stripe Payment Integration Guide

This guide explains how to set up and use the Stripe payment integration in your Marisail application.

## 🚀 Features

- **Secure Payment Processing**: Full Stripe integration with PCI compliance
- **Multiple Payment Methods**: Credit/debit cards, digital wallets
- **Payment History**: Track all user payments
- **Webhook Support**: Real-time payment notifications
- **Responsive UI**: Mobile-friendly payment forms
- **Error Handling**: Comprehensive error handling and user feedback

## 📋 Prerequisites

1. **Stripe Account**: Create a [Stripe account](https://stripe.com)
2. **Stripe API Keys**: Get your publishable and secret keys from Stripe Dashboard
3. **Node.js**: Version 16 or higher
4. **React**: Version 18 or higher

## 🔧 Backend Setup

### 1. Environment Variables

Create a `.env` file in the `node-api` directory with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Other existing variables...
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

### 2. Install Dependencies

The Stripe package is already installed. If you need to reinstall:

```bash
cd node-api
npm install stripe
```

### 3. Stripe Webhook Setup

1. Go to your Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret to your `.env` file

## 🎨 Frontend Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 2. Dependencies

The required packages are already installed:
- `@stripe/stripe-js`
- `@stripe/react-stripe-js`

## 🛠️ Usage

### 1. Payment Button Component

Use the `PaymentButton` component for simple payment initiation:

```jsx
import PaymentButton from '../components/PaymentButton';

<PaymentButton 
  amount={29.99} 
  type="subscription"
  variant="primary"
>
  Subscribe Now
</PaymentButton>
```

### 2. Payment Modal

Use the `PaymentModal` component for inline payments:

```jsx
import PaymentModal from '../components/PaymentModal';

const [isModalOpen, setIsModalOpen] = useState(false);

<PaymentModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  amount={49.99}
  paymentType="service"
  onSuccess={(paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
  }}
/>
```

### 3. Payment History

Display user payment history:

```jsx
import PaymentHistory from '../components/PaymentHistory';

<PaymentHistory userId="user123" />
```

### 4. Direct Payment Page

Navigate to the payment page with amount and type:

```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate(`/payment?amount=99.99&type=premium-plan`);
```

## 🔌 API Endpoints

### Backend Routes

- `POST /api/payment/create-payment-intent` - Create payment intent
- `POST /api/payment/confirm-payment` - Confirm payment
- `GET /api/payment/payment-history/:userId` - Get payment history
- `POST /api/payment/webhook` - Stripe webhook endpoint

### Request Examples

#### Create Payment Intent

```javascript
const response = await axios.post('/api/payment/create-payment-intent', {
  amount: 29.99,
  currency: 'usd',
  metadata: {
    userId: 'user123',
    serviceType: 'subscription'
  }
});
```

#### Confirm Payment

```javascript
const response = await axios.post('/api/payment/confirm-payment', {
  paymentIntentId: 'pi_1234567890'
});
```

## 🎯 Demo Page

Visit `/payment-demo` to see all payment components in action:

- Payment buttons with different amounts
- Payment modal examples
- Payment history display
- Various payment scenarios

## 🔒 Security Features

- **PCI Compliance**: Stripe handles all sensitive card data
- **Webhook Verification**: Secure webhook signature verification
- **HTTPS Required**: All payment requests use secure connections
- **No Card Storage**: Card details are never stored in your database

## 🧪 Testing

### Test Card Numbers

Use these test card numbers in development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Test Mode

- Use `pk_test_` and `sk_test_` keys for development
- Switch to `pk_live_` and `sk_live_` for production

## 🚀 Production Deployment

### 1. Update Environment Variables

```bash
# Production Stripe keys
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
```

### 2. Update Webhook URL

Set webhook endpoint to your production domain:
```
https://yourdomain.com/api/payment/webhook
```

### 3. SSL Certificate

Ensure your domain has a valid SSL certificate for HTTPS.

## 🐛 Troubleshooting

### Common Issues

1. **Payment Intent Creation Fails**
   - Check Stripe secret key
   - Verify amount is valid (positive number)
   - Check server logs for detailed errors

2. **Payment Confirmation Fails**
   - Verify payment intent ID
   - Check if payment was already processed
   - Ensure webhook is properly configured

3. **Frontend Stripe Loading Issues**
   - Verify publishable key
   - Check browser console for errors
   - Ensure HTTPS in production

### Debug Mode

Enable debug logging in your backend:

```javascript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Components](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

## 🤝 Support

For issues related to:
- **Stripe Integration**: Check Stripe documentation and support
- **Application Code**: Review this README and code comments
- **Environment Setup**: Verify all environment variables are set correctly

## 📝 License

This payment integration is part of the Marisail application and follows the same license terms.
