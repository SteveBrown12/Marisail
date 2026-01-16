# Payment Gateway Quick Reference

Quick reference guide for developers working with payment integrations in Marisail.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Payment Flow Architecture                 │
└─────────────────────────────────────────────────────────────┘

Frontend (React)                 Backend (Node.js)              Providers
─────────────────                ──────────────────             ──────────

Payment.jsx                   →  payment.js routes          →  Stripe API
├── Card Payment              →  /create-payment-intent
├── Apple Pay                 →  /create-apple-pay-intent
├── Google Pay                →  /create-google-pay-intent
├── Alipay                    →  /create-alipay-intent
├── WeChat Pay                →  /create-wechat-pay-intent
├── Klarna                    →  /create-klarna-intent

PayPal Flow                   →                              →  PayPal API
└── PayPal Button             →  /paypal/create-order
                              →  /paypal/capture-order

RazorpayButton.jsx            →                              →  Razorpay API
└── Razorpay Checkout         →  /razorpay/create-order
                              →  /razorpay/verify-payment

FlutterwaveButton.jsx         →                              →  Flutterwave API
└── Flutterwave Modal         →  /flutterwave/initialize
                              →  /flutterwave/verify-payment
```

---

## Payment Method Matrix

| Method | Provider | Currency | Region | Test Mode | Live Mode |
|--------|----------|----------|--------|-----------|-----------|
| Credit Card | Stripe | 135+ | Global | ✅ | Requires verification |
| Apple Pay | Stripe | 135+ | Global | ✅ | Requires domain verification |
| Google Pay | Stripe | 135+ | Global | ✅ | Auto-enabled |
| Alipay | Stripe | CNY, USD, etc. | China-focused | ✅ | Requires activation request |
| WeChat Pay | Stripe | CNY, USD, etc. | China-focused | ✅ | Requires activation request |
| Klarna | Stripe | EUR, USD, etc. | EU, US | ✅ | Requires activation request |
| PayPal | PayPal | 25+ | Global | ✅ | Requires business account |
| Razorpay | Razorpay | INR | India | ✅ | Requires KYC |
| Flutterwave | Flutterwave | 150+ | Africa-focused | ✅ | Requires verification |

---

## Component Usage

### 1. Using Payment Page
```jsx
// Navigate to payment page
navigate('/payment?amount=99.99&type=subscription');

// Or with state
navigate('/payment', {
  state: {
    amount: 99.99,
    type: 'premium-plan'
  }
});
```

### 2. Using Payment Button Components

#### Razorpay Button
```jsx
import RazorpayButton from '../components/RazorpayButton';

<RazorpayButton
  amount={100}
  currency="INR"
  onSuccess={(response) => {
    console.log('Payment successful:', response.id);
  }}
  onError={(error) => {
    console.error('Payment failed:', error);
  }}
/>
```

#### Flutterwave Button
```jsx
import FlutterwaveButton from '../components/FlutterwaveButton';

<FlutterwaveButton
  amount={100}
  currency="USD"
  onSuccess={(response) => {
    console.log('Payment successful:', response.id);
  }}
  onError={(error) => {
    console.error('Payment failed:', error);
  }}
/>
```

---

## Backend API Usage

### Create Stripe Payment Intent
```javascript
POST /api/payment/create-payment-intent

Body:
{
  "amount": 99.99,
  "currency": "usd",
  "metadata": {
    "userId": "user123",
    "orderId": "order456"
  }
}

Response:
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 99.99,
  "originalAmount": 99.99
}
```

### Create Razorpay Order
```javascript
POST /api/payment/razorpay/create-order

Body:
{
  "amount": 1000,
  "currency": "INR",
  "metadata": {
    "userId": "user123"
  }
}

Response:
{
  "orderId": "order_xxx",
  "amount": 1000,
  "currency": "INR"
}
```

### Verify Razorpay Payment
```javascript
POST /api/payment/razorpay/verify-payment

Body:
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}

Response:
{
  "success": true,
  "paymentId": "pay_xxx",
  "orderId": "order_xxx"
}
```

### Initialize Flutterwave Payment
```javascript
POST /api/payment/flutterwave/initialize-payment

Body:
{
  "amount": 100,
  "currency": "USD",
  "email": "customer@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "metadata": {
    "userId": "user123"
  }
}

Response:
{
  "status": "success",
  "message": "Hosted Link",
  "data": {...},
  "link": "https://checkout.flutterwave.com/...",
  "amount": 100
}
```

---

## Environment Variables Checklist

### Backend Required
```bash
# Stripe (for cards, Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna)
STRIPE_SECRET_KEY=sk_test_...          # Required
STRIPE_WEBHOOK_SECRET=whsec_...        # Optional but recommended

# PayPal
PAYPAL_CLIENT_ID=...                   # Required for PayPal
PAYPAL_CLIENT_SECRET=...               # Required for PayPal
PAYPAL_ENV=sandbox                     # sandbox or live

# Razorpay (Indian market)
RAZORPAY_KEY_ID=rzp_test_...          # Required for Razorpay
RAZORPAY_KEY_SECRET=...               # Required for Razorpay

# Flutterwave (African market)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-... # Required for Flutterwave
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-... # Required for Flutterwave
FLUTTERWAVE_ENCRYPTION_KEY=...          # Optional

# Other
FRONTEND_URL=http://localhost:5173      # For redirects
```

### Frontend Required
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Required for Stripe payments
VITE_PAYPAL_CLIENT_ID=...                # Required for PayPal
VITE_BACKEND_URL=http://localhost:3001/api # Backend API URL
```

---

## Testing Credentials

### Stripe Test Cards
```
Success:        4242 4242 4242 4242
Decline:        4000 0000 0000 0002
3D Secure:      4000 0025 0000 3155
Insufficient:   4000 0000 0000 9995

Any future date for expiry
Any 3 digits for CVC
Any name
```

### Razorpay Test Cards
```
Success:        4111 1111 1111 1111
OTP:            1234 (for any test transaction)
CVV:            123
Expiry:         Any future date
```

### Flutterwave Test Cards
```
Success:        5531 8866 5214 2950
CVV:            564
Expiry:         09/32
PIN:            3310
OTP:            12345
```

---

## Error Handling

### Common Errors and Solutions

#### "Payment service is not configured"
- **Cause**: Missing environment variables
- **Solution**: Add required keys to `.env` file

#### "Failed to create payment intent"
- **Cause**: Invalid API keys or amount
- **Solution**: Check API keys and ensure amount > 0

#### "Payment verification failed"
- **Cause**: Incorrect signature or tampered data
- **Solution**: Ensure webhook secrets are correct

#### "Domain not verified" (Apple Pay)
- **Cause**: Apple Pay domain verification incomplete
- **Solution**: Complete domain verification in Stripe Dashboard

---

## Payment Flow Diagrams

### Stripe Card Payment Flow
```
1. User clicks "Pay with Credit Card"
2. Frontend: Create payment intent → Backend
3. Backend: Create intent → Stripe API
4. Backend: Return client secret → Frontend
5. Frontend: Show Stripe card element
6. User enters card details
7. Frontend: Confirm payment → Stripe.js
8. Stripe: Process payment
9. Frontend: Confirm on backend
10. Backend: Verify with Stripe
11. Success/Failure response
```

### Razorpay Payment Flow
```
1. User clicks "Pay with Razorpay"
2. Frontend: Create order → Backend
3. Backend: Create order → Razorpay API
4. Backend: Return order ID → Frontend
5. Frontend: Open Razorpay checkout modal
6. User completes payment in modal
7. Razorpay: Return payment details
8. Frontend: Verify payment → Backend
9. Backend: Verify signature
10. Success/Failure response
```

### Flutterwave Payment Flow
```
1. User clicks "Pay with Flutterwave"
2. Frontend: Initialize payment → Backend
3. Backend: Create transaction → Flutterwave API
4. Backend: Return payment link → Frontend
5. Frontend: Open Flutterwave modal
6. User completes payment
7. Flutterwave: Return transaction ID
8. Frontend: Verify transaction → Backend
9. Backend: Verify with Flutterwave API
10. Success/Failure response
```

---

## Currency Handling

The system includes smart currency rounding via `exchangeRateService.js`:

```javascript
// Rounds amount based on currency denomination
const roundedAmount = exchangeRateService.roundForPayment(amount, currency);

// Prepares amount for Stripe (handles zero-decimal currencies)
const stripeAmount = exchangeRateService.prepareAmountForStripe(amount, currency);

// Example: JPY (zero-decimal)
// Input: 1000.50 JPY
// Output: 1001 (no decimals)

// Example: USD (two-decimal)
// Input: 99.99 USD
// Output: 9999 (cents)
```

### Zero-Decimal Currencies
These currencies don't use decimal places:
- JPY (Japanese Yen)
- KRW (Korean Won)
- CLP (Chilean Peso)
- And more...

---

## Debugging Tips

### Enable Console Logs
All payment routes include console.log statements. Check:
- Browser console (frontend)
- Server logs (backend)

### Check Payment Config
```javascript
// Frontend: Check which gateways are enabled
fetch('http://localhost:3001/api/payment/config')
  .then(r => r.json())
  .then(console.log);

// Response shows enabled status for each gateway
```

### Test Webhooks Locally
Use ngrok or similar to expose local server:
```bash
ngrok http 3001
# Use the HTTPS URL for webhook configuration
```

---

## Performance Optimization

### Lazy Load Payment Scripts
Payment scripts are loaded on-demand:
- Stripe.js loads when Stripe payment selected
- Razorpay SDK loads dynamically in RazorpayButton
- Flutterwave script loaded via react-flutterwave

### Caching
- Payment configuration is cached in frontend state
- Exchange rates are cached in backend service

---

## Security Checklist

- [ ] API keys in environment variables (not hardcoded)
- [ ] HTTPS enabled in production
- [ ] Webhook signature verification enabled
- [ ] CORS properly configured
- [ ] Rate limiting on payment endpoints
- [ ] Input validation on all payment amounts
- [ ] Audit logging for payment attempts
- [ ] No sensitive data in client-side logs

---

## Quick Command Reference

### Install Dependencies
```bash
# Backend
cd backend && npm install razorpay flutterwave-node-v3

# Frontend
cd frontend && npm install react-flutterwave --legacy-peer-deps
```

### Start Services
```bash
# Backend (Terminal 1)
cd backend && npm start

# Frontend (Terminal 2)
cd frontend && npm run dev
```

### Test Payment
```bash
# Open browser
http://localhost:5173/payment?amount=100&type=test
```

---

**Quick Help**: If something doesn't work:
1. Check environment variables are set
2. Restart both frontend and backend
3. Check browser console for errors
4. Check backend terminal for logs
5. Verify API keys are correct (test vs live)

