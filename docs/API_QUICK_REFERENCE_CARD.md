# API Quick Reference Card

**Quick access guide for developers**
**Last Updated**: November 7, 2025

---

## 🔑 API Keys Location

### Frontend (.env)
```bash
VITE_AUTH0_DOMAIN=marisail.us.auth0.com
VITE_AUTH0_CLIENT_ID=pSSokqtqRvTqKS3JdpijYpowdYBmKVtR
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RH55R...
VITE_PAYPAL_CLIENT_ID=AeWwaW1s3ukL...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_IPINFO_API_KEY=your_key_here
VITE_BACKEND_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```bash
STRIPE_SECRET_KEY=sk_test_51RH55R...
PAYPAL_CLIENT_SECRET=...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
EXCHANGE_RATE_API_KEY=618a428dd3b2ea6adc05e43b
```

---

## 🌐 API Endpoints Quick Reference

### Authentication (Auth0)
```
Provider: Auth0
Files: src/auth/AuthProvider.jsx
Dashboard: https://manage.auth0.com
```

### Payments

#### Stripe
```
POST /api/payment/create-payment-intent
POST /api/payment/confirm-payment
POST /api/payment/webhook
GET  /api/payment/config
```

#### PayPal
```
POST /api/payment/paypal/create-order
POST /api/payment/paypal/capture-order
```

#### Razorpay
```
POST /api/payment/razorpay/create-order
POST /api/payment/razorpay/verify-payment
```

#### Flutterwave
```
POST /api/payment/flutterwave/initialize-payment
POST /api/payment/flutterwave/verify-payment
```

### Utilities
```
GET  /api/payment/currency/:code
POST /api/payment/round-amount
POST /api/home/ipinfo
```

---

## 🧪 Test Credentials

### Stripe
```
Card: 4242 4242 4242 4242
Exp:  Any future date
CVC:  Any 3 digits
```

### Razorpay
```
Card: 4111 1111 1111 1111
OTP:  1234
```

### Flutterwave
```
Card:   5531 8866 5214 2950
CVV:    564
Expiry: 09/32
PIN:    3310
OTP:    12345
```

---

## 📂 Key Files Map

### Backend
```
backend/src/routes/payment.js              → All payment endpoints
backend/src/services/exchangeRateService.js → Currency conversion
```

### Frontend Auth
```
src/auth/AuthProvider.jsx                  → Auth0 wrapper
src/pages/Login.jsx                        → Login page
src/pages/Registration.jsx                 → Registration
```

### Frontend Payments
```
src/pages/Payment.jsx                      → Main payment page
src/components/RazorpayButton.jsx          → Razorpay integration
src/components/FlutterwaveButton.jsx       → Flutterwave integration
```

### Analytics & Utils
```
src/utils/analytics.js                     → Google Analytics
src/utils/ipInfo.js                        → IP geolocation
src/utils/currencyUtils.js                 → Currency utilities
src/components/GoogleTranslate.tsx         → Translation widget
```

---

## 🚀 Quick Start Commands

### Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Start Development
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

## 🔍 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Payment service not configured" | Add API keys to `.env` |
| "Auth0 not loading" | Check `VITE_AUTH0_DOMAIN` and `CLIENT_ID` |
| "Currency not detected" | Add `VITE_IPINFO_API_KEY` |
| Payment fails | Check console for errors, verify API keys |
| Webhook not working | Set `STRIPE_WEBHOOK_SECRET` |

---

## 📊 API Status Dashboard

| API | Status | Files | Key Location |
|-----|--------|-------|--------------|
| Auth0 | ✅ | 8 | Frontend .env |
| Stripe | ✅ | 12 | Both .env |
| PayPal | ✅ | 2 | Both .env |
| Razorpay | ✅ | 3 | Backend .env |
| Flutterwave | ✅ | 3 | Backend .env |
| Google Analytics | ✅ | 3 | Frontend .env |
| IPInfo | ✅ | 4 | Frontend .env |
| Google Translate | ✅ | 7 | No key needed |
| ExchangeRate | ✅ | 3 | Backend .env |

---

## 📞 Quick Links

- **Full Documentation**: `docs/API_HANDOVER_DOCUMENTATION.md`
- **Payment Setup**: `docs/PAYMENT_GATEWAYS_SETUP.md`
- **Payment Reference**: `docs/PAYMENT_QUICK_REFERENCE.md`
- **Currency Guide**: `docs/CURRENCY_DETECTION.md`

---

**Print this page and keep it handy! 📋**
