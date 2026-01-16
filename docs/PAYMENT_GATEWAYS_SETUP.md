# Complete Payment Gateway Setup Guide

This guide covers the setup and configuration of all 4 payment gateway providers in the Marisail application, supporting 9 different payment methods.

## Overview

### Payment Providers
1. **Stripe** - Credit Cards, Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna
2. **PayPal** - PayPal Account payments
3. **Razorpay** - Indian market (UPI, Cards, Netbanking)
4. **Flutterwave** - African market (Cards, Mobile Money, Bank Transfers)

### Total Payment Methods: 9
1. Credit/Debit Cards (Stripe)
2. PayPal
3. Apple Pay (Stripe)
4. Google Pay (Stripe)
5. Razorpay (Indian market)
6. Alipay (Stripe - Chinese market)
7. WeChat Pay (Stripe - Chinese market)
8. Flutterwave (African market)
9. Klarna (Stripe - Buy Now, Pay Later)

---

## 1. Stripe Setup

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Sign up for an account
3. Complete the onboarding process

### Step 2: Get API Keys
1. Navigate to **Developers → API Keys**
2. Copy your:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

### Step 3: Enable Payment Methods
1. Go to **Settings → Payment methods**
2. Enable the following:
   - **Cards** (enabled by default)
   - **Apple Pay** - Requires domain verification
   - **Google Pay** (usually auto-enabled)
   - **Alipay** - Request activation for Chinese market
   - **WeChat Pay** - Request activation for Chinese market
   - **Klarna** - Request activation for BNPL

### Step 4: Domain Verification (for Apple Pay)
1. Go to **Settings → Payment methods → Apple Pay**
2. Add your domain
3. Download the verification file
4. Upload it to `/.well-known/apple-developer-merchantid-domain-association` on your server
5. Click verify

### Step 5: Configure Environment Variables

**Backend** (`backend/.env`):
```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Frontend** (`frontend/.env`):
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

---

## 2. PayPal Setup

### Step 1: Create PayPal Business Account
1. Go to https://developer.paypal.com
2. Sign up for a developer account
3. Access the Dashboard

### Step 2: Create REST API App
1. Navigate to **My Apps & Credentials**
2. Click **Create App**
3. Choose **Merchant** for app type
4. Note the **Client ID** and **Secret**

### Step 3: Sandbox Testing
1. In the developer dashboard, go to **Sandbox → Accounts**
2. Use the test accounts for testing payments

### Step 4: Configure Environment Variables

**Backend** (`backend/.env`):
```bash
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENV=sandbox  # or 'live' for production
```

**Frontend** (`frontend/.env`):
```bash
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

---

## 3. Razorpay Setup (Indian Market)

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Sign up for an account
3. Complete KYC verification (required for live mode)

### Step 2: Get API Keys
1. Go to **Settings → API Keys**
2. Generate keys if not already generated
3. Copy your:
   - **Key ID** (starts with `rzp_test_` for test mode)
   - **Key Secret**

### Step 3: Enable Payment Methods
1. Go to **Settings → Payment Methods**
2. Enable:
   - **UPI**
   - **Cards**
   - **Netbanking**
   - **Wallets**

### Step 4: Configure Environment Variables

**Backend** (`backend/.env`):
```bash
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Test Cards (INR only)
- **Success**: 4111 1111 1111 1111
- **OTP for testing**: 1234

### Currency Support
- Razorpay primarily supports **INR (Indian Rupees)**
- The system automatically sets currency to INR for Razorpay payments

---

## 4. Flutterwave Setup (African Market)

### Step 1: Create Flutterwave Account
1. Go to https://flutterwave.com
2. Sign up for an account
3. Complete verification process

### Step 2: Get API Keys
1. Go to **Settings → API Keys**
2. Copy your:
   - **Public Key**
   - **Secret Key**
   - **Encryption Key** (optional but recommended)

### Step 3: Enable Payment Methods
Available payment methods:
- **Cards** (Visa, Mastercard)
- **Mobile Money** (M-Pesa, MTN, Airtel, etc.)
- **Bank Transfers**
- **USSD**

### Step 4: Configure Environment Variables

**Backend** (`backend/.env`):
```bash
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_public_key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-your_encryption_key
```

### Test Cards
- **Success**: 5531 8866 5214 2950
- **CVV**: 564
- **Expiry**: 09/32
- **PIN**: 3310
- **OTP**: 12345

### Supported Currencies
- **USD**, **NGN**, **GHS**, **KES**, **ZAR**, **UGX**, **TZS**, and more
- Full list: https://developer.flutterwave.com/docs/integration-guides/currencies

---

## Complete Environment Variables Reference

### Backend `.env` file
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=AeWwaW1s3ukL...
PAYPAL_CLIENT_SECRET=EJoK-WEhV...
PAYPAL_ENV=sandbox

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_here

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-...

# Other
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` file
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
VITE_PAYPAL_CLIENT_ID=AeWwaW1s3ukL...
VITE_BACKEND_URL=http://localhost:3001/api
```

---

## API Endpoints

### Stripe Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payment/create-payment-intent` | Create payment intent |
| POST | `/api/payment/create-apple-pay-intent` | Create Apple Pay intent |
| POST | `/api/payment/create-google-pay-intent` | Create Google Pay intent |
| POST | `/api/payment/create-alipay-intent` | Create Alipay intent |
| POST | `/api/payment/create-wechat-pay-intent` | Create WeChat Pay intent |
| POST | `/api/payment/create-klarna-intent` | Create Klarna intent |
| POST | `/api/payment/confirm-payment` | Confirm payment |
| POST | `/api/payment/webhook` | Stripe webhook |

### PayPal Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payment/paypal/create-order` | Create PayPal order |
| POST | `/api/payment/paypal/capture-order` | Capture PayPal order |

### Razorpay Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payment/razorpay/create-order` | Create Razorpay order |
| POST | `/api/payment/razorpay/verify-payment` | Verify Razorpay payment |

### Flutterwave Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payment/flutterwave/initialize-payment` | Initialize Flutterwave payment |
| POST | `/api/payment/flutterwave/verify-payment` | Verify Flutterwave payment |

### Configuration Endpoint
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/payment/config` | Get all payment gateway configurations |

---

## Testing the Integration

### 1. Start the Application

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 2. Access Payment Page
Navigate to: `http://localhost:5173/payment?amount=100&type=test`

### 3. Test Each Payment Method

#### Test Stripe Card Payment
1. Select **Credit Card**
2. Enter test card: `4242 4242 4242 4242`
3. Enter any future expiry date and CVC
4. Complete payment

#### Test PayPal
1. Select **PayPal**
2. Log in with PayPal sandbox account
3. Complete payment

#### Test Razorpay
1. Select **Razorpay**
2. Click the payment button
3. In the modal, use test card or select UPI
4. Complete with test credentials

#### Test Flutterwave
1. Select **Flutterwave**
2. Click the payment button
3. In the modal, use test card
4. Complete with test credentials

---

## Production Deployment

### 1. Switch to Live Mode

For each gateway, get **production/live** API keys:

**Stripe:**
- Change `pk_test_` → `pk_live_`
- Change `sk_test_` → `sk_live_`

**PayPal:**
- Change `PAYPAL_ENV` from `sandbox` to `live`
- Use production Client ID and Secret

**Razorpay:**
- Change `rzp_test_` → `rzp_live_`
- Requires completed KYC

**Flutterwave:**
- Change `FLWPUBK_TEST` → `FLWPUBK`
- Change `FLWSECK_TEST` → `FLWSECK`

### 2. Configure Webhooks

**Stripe:**
1. Add webhook endpoint: `https://yourdomain.com/api/payment/webhook`
2. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

**PayPal:**
- Webhooks are optional for PayPal's checkout flow

**Razorpay:**
1. Go to Settings → Webhooks
2. Add: `https://yourdomain.com/api/payment/razorpay/webhook`
3. Select payment events

**Flutterwave:**
1. Go to Settings → Webhooks
2. Add: `https://yourdomain.com/api/payment/flutterwave/webhook`
3. Set secret hash

### 3. SSL Certificate
Ensure your domain has a valid SSL certificate (required for all payment processing)

---

## Currency Support

| Gateway | Primary Currency | Other Currencies Supported |
|---------|------------------|---------------------------|
| Stripe | USD | 135+ currencies |
| PayPal | USD | 25+ currencies |
| Razorpay | INR | Limited international |
| Flutterwave | USD | 150+ currencies |

The system automatically handles currency conversion using the Exchange Rate Service.

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Enable webhook signature verification** in production
4. **Use HTTPS** for all payment pages
5. **Implement rate limiting** on payment endpoints
6. **Log payment attempts** for audit trails
7. **Verify payments on the backend** before fulfillment

---

## Troubleshooting

### Stripe Issues
- **Error: "No such payment method"** → Enable the payment method in Stripe Dashboard
- **Apple Pay not working** → Verify domain ownership
- **Card declined** → Use test card numbers from Stripe docs

### PayPal Issues
- **"Merchant not enabled"** → Ensure app is approved for live mode
- **Sandbox account locked** → Create new sandbox account

### Razorpay Issues
- **"key_id is invalid"** → Check if using test vs live keys correctly
- **Payment fails** → Ensure currency is INR
- **Webhook not working** → Verify signature with Razorpay secret

### Flutterwave Issues
- **"Invalid public key"** → Ensure using correct test/live key
- **Transaction verification fails** → Check transaction_id format
- **Currency not supported** → Check Flutterwave currency support

---

## Support and Documentation

### Official Documentation
- **Stripe**: https://stripe.com/docs
- **PayPal**: https://developer.paypal.com/docs
- **Razorpay**: https://razorpay.com/docs
- **Flutterwave**: https://developer.flutterwave.com/docs

### Contact Support
- For payment gateway issues, contact respective provider support
- For integration issues, check the backend logs in `backend/logs/`

---

## Next Steps

1. ✅ Configure environment variables
2. ✅ Test in development mode
3. ✅ Verify webhook functionality
4. ✅ Test each payment method
5. ✅ Switch to production keys
6. ✅ Deploy to production
7. ✅ Monitor transactions
8. ✅ Set up alerts for failed payments

---

**Last Updated**: 2025-11-07
**Version**: 2.0.0
