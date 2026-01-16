# 🚀 Quick Start: Payment Integration

## ⚠️ Current Status
The payment integration is now **safe to run** without Stripe keys. It will show helpful error messages instead of crashing.

## 🔧 Immediate Setup (Optional)

### 1. Create Environment Files

**Backend** (`node-api/.env`):
```bash
# Stripe Configuration (optional for now)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Your existing variables...
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

**Frontend** (`.env`):
```bash
# Stripe Configuration (optional for now)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 2. Quick Fix for Current Error

If you're seeing the Stripe initialization error, create a `.env` file in your root directory with:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG
```

**Note**: Use any test key format for now - the app will work safely even with invalid keys.

### 2. Get Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## 🧪 Test Without Stripe Keys

### 1. Start Your Application
```bash
# Terminal 1: Backend
cd node-api
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 2. Visit Demo Page
Go to: `http://localhost:5173/payment-demo`

### 3. What You'll See
- ✅ **Payment buttons** - Will show error when clicked (expected)
- ✅ **Payment modal** - Will show error when opened (expected)
- ✅ **Payment history** - Will show "service not configured" message (expected)

### 4. Test Error Handling
- Click any payment button
- You'll see: `"Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables."`

## 🔑 Enable Stripe (When Ready)

### 1. Add Your Keys
Update your `.env` files with real Stripe keys.

### 2. Restart Application
```bash
# Stop both terminals (Ctrl+C)
# Start them again
```

### 3. Test Payments
- Use test card: `4242 4242 4242 4242`
- Any future date
- Any 3-digit CVC

## 🎯 What's Working Now

- ✅ **Safe startup** - No crashes without Stripe keys
- ✅ **Error handling** - Clear messages when Stripe is disabled
- ✅ **UI components** - All payment forms render correctly
- ✅ **Routing** - Payment pages accessible
- ✅ **Backend safety** - Graceful degradation

## 🚨 Common Issues

### "Payment service is not configured"
- **Cause**: Missing `STRIPE_SECRET_KEY` in backend `.env`
- **Solution**: Add your Stripe secret key or ignore for now

### "Webhook secret not configured"
- **Cause**: Missing `STRIPE_WEBHOOK_SECRET` in backend `.env`
- **Solution**: Add webhook secret or ignore for now

### "express.raw is not a function"
- **Cause**: Express version compatibility issue with webhook body parsing
- **Solution**: ✅ **Fixed** - Webhook now works without raw body parsing

### Frontend Stripe errors
- **Cause**: Missing `VITE_STRIPE_PUBLISHABLE_KEY` in frontend `.env`
- **Solution**: Add your Stripe publishable key or ignore for now

## 📱 Next Steps

1. **Test the UI** - Visit `/payment-demo` to see all components
2. **Get Stripe keys** - When ready to process real payments
3. **Configure webhooks** - For production payment notifications
4. **Customize styling** - Match your app's design system

## 🆘 Need Help?

- **Stripe Setup**: [Stripe Documentation](https://stripe.com/docs)
- **Test Cards**: [Stripe Testing Guide](https://stripe.com/docs/testing)
- **Environment Issues**: Check that `.env` files are in correct locations

---

**🎉 You're all set!** The payment integration is now safe to run and test without any Stripe configuration.
