# Quick Start: Payment Gateways

Get your payment system up and running in 5 minutes!

## 🚀 Quick Setup (Choose One)

### Option 1: Test with Stripe Only (Fastest)

#### Step 1: Get Stripe Test Keys (2 minutes)
1. Go to https://dashboard.stripe.com/register
2. Skip verification (use test mode)
3. Go to: Developers → API Keys
4. Copy your test keys

#### Step 2: Configure Environment Variables
```bash
# Backend: backend/.env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Frontend: frontend/.env (if not already set)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_BACKEND_URL=http://localhost:3001/api
```

#### Step 3: Start & Test
```bash
# Terminal 1
cd backend && npm install && npm start

# Terminal 2
cd frontend && npm install && npm run dev

# Open browser
http://localhost:5173/payment?amount=100&type=test
```

#### Step 4: Test Payment
- Select "Credit Card"
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Click Pay

✅ **Done!** You have 6 payment methods working (Cards, Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna)

---

### Option 2: Test with All 4 Providers (10 minutes)

#### Step 1: Get All API Keys

**Stripe** (2 min):
1. https://dashboard.stripe.com/register
2. Get test keys from Developers → API Keys

**PayPal** (3 min):
1. https://developer.paypal.com
2. Log in with PayPal account
3. Create REST API app
4. Copy Client ID and Secret from sandbox

**Razorpay** (2 min):
1. https://dashboard.razorpay.com/signup
2. Get test keys from Settings → API Keys

**Flutterwave** (3 min):
1. https://dashboard.flutterwave.com/signup
2. Get test keys from Settings → API Keys

#### Step 2: Configure All Variables

Create/update **`backend/.env`**:
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_51...

# PayPal
PAYPAL_CLIENT_ID=AeWwa...
PAYPAL_CLIENT_SECRET=EJoK-...
PAYPAL_ENV=sandbox

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
```

Create/update **`frontend/.env`**:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
VITE_PAYPAL_CLIENT_ID=AeWwa...
VITE_BACKEND_URL=http://localhost:3001/api
```

#### Step 3: Install & Start
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

#### Step 4: Test All 9 Methods
Open: http://localhost:5173/payment?amount=100&type=test

**Test Cards**:
- Stripe: `4242 4242 4242 4242`
- Razorpay: `4111 1111 1111 1111` (OTP: 1234)
- Flutterwave: `5531 8866 5214 2950` (CVV: 564, PIN: 3310, OTP: 12345)

✅ **Done!** All 9 payment methods working!

---

## 🎯 Which Payment Methods Need What?

| Method | Provider | Needs |
|--------|----------|-------|
| Credit Card | Stripe | Stripe keys |
| Apple Pay | Stripe | Stripe keys |
| Google Pay | Stripe | Stripe keys |
| Alipay | Stripe | Stripe keys |
| WeChat Pay | Stripe | Stripe keys |
| Klarna | Stripe | Stripe keys |
| PayPal | PayPal | PayPal keys |
| Razorpay | Razorpay | Razorpay keys |
| Flutterwave | Flutterwave | Flutterwave keys |

---

## 🔍 Troubleshooting

### "Payment service is not configured"
❌ Missing environment variables
✅ Add the required keys to `.env` files

### "ECONNREFUSED" or Backend Error
❌ Backend not running
✅ Start backend: `cd backend && npm start`

### Frontend Shows Loading Indefinitely
❌ Wrong VITE_BACKEND_URL
✅ Set: `VITE_BACKEND_URL=http://localhost:3001/api`

### Payment Buttons Disabled
❌ Provider not configured
✅ Check that you added the right keys for that provider

### Razorpay Modal Doesn't Open
❌ Script loading issue
✅ Check browser console, refresh page

### Flutterwave Shows Error
❌ Peer dependency warning (harmless)
✅ Ignore warning, or run with `--legacy-peer-deps`

---

## 📝 Test Credentials Cheat Sheet

### Stripe
```
Card:   4242 4242 4242 4242
Expiry: 12/34
CVC:    123
ZIP:    12345
```

### Razorpay (INR only)
```
Card:   4111 1111 1111 1111
Expiry: 12/34
CVV:    123
OTP:    1234
```

### Flutterwave
```
Card:   5531 8866 5214 2950
Expiry: 09/32
CVV:    564
PIN:    3310
OTP:    12345
```

### PayPal
Use sandbox accounts from PayPal Developer Dashboard

---

## 🎨 Testing Different Amounts

```bash
# Test $50 payment
http://localhost:5173/payment?amount=50&type=subscription

# Test $999 payment
http://localhost:5173/payment?amount=999&type=premium

# Test ₹1000 payment (use Razorpay)
http://localhost:5173/payment?amount=1000&type=test
# Select Razorpay (auto converts to INR)
```

---

## ✅ Success Checklist

After setup, you should be able to:
- [ ] See payment page at `/payment?amount=100&type=test`
- [ ] See 9 payment method options
- [ ] Click each payment method and see the form/modal
- [ ] Complete a test payment with Stripe card
- [ ] Complete a test payment with Razorpay
- [ ] Complete a test payment with Flutterwave
- [ ] See success toast notification
- [ ] Get redirected to success page

---

## 📚 Next Steps

1. **Learn More**: Read `docs/PAYMENT_GATEWAYS_SETUP.md` for detailed setup
2. **Developer Guide**: Check `docs/PAYMENT_QUICK_REFERENCE.md` for API docs
3. **Implementation Details**: Read `PAYMENT_IMPLEMENTATION_SUMMARY.md`

---

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check backend terminal for logs
3. Verify environment variables are set correctly
4. Restart both frontend and backend
5. Check the documentation files in `/docs`

---

## 🚀 Going to Production

When ready for production:
1. Get live API keys from each provider
2. Replace all `_test_` keys with `_live_` keys
3. Set `PAYPAL_ENV=live`
4. Complete KYC for Razorpay
5. Complete verification for Flutterwave
6. Set up webhooks for all providers
7. Enable SSL certificate
8. Test thoroughly in production environment

---

**You're ready to accept payments! 🎉**

For detailed information, see:
- `docs/PAYMENT_GATEWAYS_SETUP.md` - Complete setup guide
- `docs/PAYMENT_QUICK_REFERENCE.md` - Developer reference
- `PAYMENT_IMPLEMENTATION_SUMMARY.md` - What was implemented
