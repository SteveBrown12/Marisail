# Automatic Currency Detection

## Overview

The payment system now **automatically detects the user's location and currency** using IP geolocation, and adjusts the payment experience accordingly.

**Last Updated**: November 7, 2025
**Status**: ✅ Implemented and Active

---

## How It Works

### 1. IP-Based Geolocation

When a user visits the payment page, the system:

1. **Checks localStorage** for cached location data (`ipInfo`)
2. If not cached, **fetches from IP geolocation API** (`ipinfo.io`)
3. **Sends country code** to backend to get complete location info
4. **Stores in localStorage** for subsequent visits

### 2. Currency Detection

The system automatically detects:
- **Country** (e.g., "United States")
- **Country Code** (e.g., "US")
- **Currency** (e.g., "USD")
- **Currency Symbol** (e.g., "$")
- **Language** (e.g., "English")

### 3. Payment Gateway Recommendations

Based on location, the system recommends the most suitable payment gateway:

| Location | Recommended Gateway | Reason |
|----------|-------------------|---------|
| India (IN) | Razorpay 🇮🇳 | Native support for UPI, INR, Netbanking |
| Nigeria, Ghana, Kenya, etc. | Flutterwave 🌍 | African market specialist |
| China (CN) | Alipay 🇨🇳 | Chinese market preference |
| Other countries | Stripe/PayPal 💳 | Global coverage |

---

## Implementation Details

### Frontend (Payment.jsx)

#### Currency State Management
```javascript
const [userCurrency, setUserCurrency] = useState('USD');
const [userCountry, setUserCountry] = useState('US');
const [currencySymbol, setCurrencySymbol] = useState('$');
```

#### Geolocation Detection
```javascript
useEffect(() => {
  const detectLocationAndCurrency = async () => {
    // Try localStorage first
    const cachedIpInfo = localStorage.getItem('ipInfo');
    let ipInfo = cachedIpInfo ? JSON.parse(cachedIpInfo) : await initIPInfo();

    if (ipInfo) {
      setUserCurrency(ipInfo.currency || 'USD');
      setUserCountry(ipInfo.countryCode || 'US');
      setCurrencySymbol(ipInfo.currencySymbol || '$');

      // Show notification
      toast.info(`Payment currency set to ${ipInfo.currency} based on your location`);
    }
  };

  detectLocationAndCurrency();
}, []);
```

#### Gateway Recommendation Logic
```javascript
const getRecommendedGateway = () => {
  // African countries
  const africanCountries = ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'RW', 'SL', 'GM'];
  if (africanCountries.includes(userCountry)) return 'flutterwave';

  // India
  if (userCountry === 'IN' || userCurrency === 'INR') return 'razorpay';

  // China
  if (userCountry === 'CN' || userCurrency === 'CNY') return 'alipay';

  // Default
  return 'stripe';
};
```

#### Dynamic Currency Usage
All payment methods now use the detected currency:
```javascript
// Stripe payment intent
currency: userCurrency.toLowerCase()

// PayPal
currency: userCurrency

// Razorpay & Flutterwave
currency={userCurrency}
```

### Backend Support

The backend already supports multi-currency through:
- **Stripe**: 135+ currencies
- **PayPal**: 25+ currencies
- **Razorpay**: INR primarily
- **Flutterwave**: 150+ currencies

Currency conversion and rounding handled by:
- `backend/src/services/exchangeRateService.js`

---

## User Experience

### Visual Indicators

#### 1. Location Badge
Shows detected country and currency:
```
📍 Payment currency: INR (IN)
```

#### 2. Recommended Gateway Badge
Green "✓ Recommended" badge on suggested payment method

#### 3. Currency Display
Amount shown with detected currency:
```
₹1,000.00
INR
```

#### 4. Toast Notification
On page load:
```
ℹ️ Payment currency set to EUR based on your location (Germany)
```

---

## Currency Mapping Examples

### Example 1: User in India
```
Detected: IN / INR / ₹
Recommended: Razorpay
Amount Display: ₹100.00
Payment Intent: { amount: 100, currency: 'inr' }
```

### Example 2: User in Nigeria
```
Detected: NG / NGN / ₦
Recommended: Flutterwave
Amount Display: ₦10,000.00
Payment Intent: { amount: 10000, currency: 'ngn' }
```

### Example 3: User in UK
```
Detected: GB / GBP / £
Recommended: Stripe
Amount Display: £50.00
Payment Intent: { amount: 50, currency: 'gbp' }
```

### Example 4: User in USA
```
Detected: US / USD / $
Recommended: Stripe
Amount Display: $100.00
Payment Intent: { amount: 100, currency: 'usd' }
```

---

## Testing Currency Detection

### Method 1: Test with VPN
1. Connect to VPN in different country
2. Clear localStorage: `localStorage.clear()`
3. Visit payment page
4. Observe detected currency

### Method 2: Mock localStorage
```javascript
// In browser console
localStorage.setItem('ipInfo', JSON.stringify({
  country: 'India',
  countryCode: 'IN',
  currency: 'INR',
  currencySymbol: '₹',
  language: 'English'
}));

// Reload page
location.reload();
```

### Method 3: Test Different Countries

#### Test India:
```javascript
localStorage.setItem('ipInfo', JSON.stringify({
  countryCode: 'IN',
  currency: 'INR',
  currencySymbol: '₹',
  country: 'India'
}));
```
Expected: Razorpay recommended, ₹ symbol

#### Test Nigeria:
```javascript
localStorage.setItem('ipInfo', JSON.stringify({
  countryCode: 'NG',
  currency: 'NGN',
  currencySymbol: '₦',
  country: 'Nigeria'
}));
```
Expected: Flutterwave recommended, ₦ symbol

#### Test UK:
```javascript
localStorage.setItem('ipInfo', JSON.stringify({
  countryCode: 'GB',
  currency: 'GBP',
  currencySymbol: '£',
  country: 'United Kingdom'
}));
```
Expected: Stripe recommended, £ symbol

---

## Supported Currencies

### Full List (100+)
The system supports all currencies that the payment providers support:

**Stripe**: 135+ currencies including USD, EUR, GBP, JPY, CNY, INR, etc.
**PayPal**: 25+ major currencies
**Razorpay**: INR (Indian Rupee)
**Flutterwave**: 150+ currencies (African and global)

### Currency Rounding
Smart rounding based on currency type:
- **Zero-decimal**: JPY, KRW (no decimals)
- **Two-decimal**: USD, EUR, GBP (cents/pence)
- **Three-decimal**: BHD, JOD, KWD (fils)

Handled automatically by `exchangeRateService.js`

---

## Fallback Behavior

If geolocation fails:
1. **Default to USD** ($)
2. **Default country: US**
3. **Continue with payment** (no blocking)
4. **User can still pay** with any method

---

## Privacy Considerations

- **IP geolocation only** (no GPS)
- **Country-level accuracy** (not street address)
- **Cached in localStorage** (not sent to server repeatedly)
- **Used for UX only** (not for blocking access)
- **Transparent to user** (shows detected location)

---

## Configuration

### Required Environment Variables

**Frontend:**
```bash
VITE_IPINFO_API_KEY=your_ipinfo_api_key
VITE_BACKEND_URL=http://localhost:3001/api
```

**Backend:**
Endpoint must exist: `POST /api/home/ipinfo`

### Get IPInfo API Key
1. Go to https://ipinfo.io
2. Sign up for free account
3. Copy API token
4. Add to `frontend/.env`

---

## Integration Points

### Files Modified
1. `frontend/src/pages/Payment.jsx` - Added currency detection
2. `frontend/src/utils/ipInfo.js` - Geolocation utility (already existed)
3. Backend payment routes - Already support multi-currency

### New Features
- ✅ Automatic currency detection
- ✅ Country-based gateway recommendation
- ✅ Visual location indicator
- ✅ Recommended badge on gateways
- ✅ Currency symbol in amount display
- ✅ Multi-currency support in all payment flows

---

## Troubleshooting

### Currency not detected?
1. Check `VITE_IPINFO_API_KEY` is set
2. Check browser console for errors
3. Try clearing localStorage
4. Check backend `/home/ipinfo` endpoint works

### Wrong currency detected?
1. Check VPN/proxy settings
2. Clear localStorage and refresh
3. Manually set currency in localStorage (for testing)

### Payment fails with detected currency?
1. Check if payment provider supports the currency
2. Razorpay only supports INR
3. Some Stripe methods have currency restrictions
4. Check backend logs for currency errors

---

## Future Enhancements

Potential improvements:
- [ ] Allow user to manually change currency
- [ ] Remember user's currency preference
- [ ] Show currency conversion rates
- [ ] Multi-currency wallet support
- [ ] Historical exchange rate tracking
- [ ] Currency-specific payment terms

---

## Related Documentation

- `docs/PAYMENT_GATEWAYS_SETUP.md` - Complete payment setup guide
- `docs/PAYMENT_QUICK_REFERENCE.md` - API reference
- `backend/src/services/exchangeRateService.js` - Currency conversion logic
- `frontend/src/hooks/useCurrency.js` - Currency utilities

---

**The payment system now automatically adapts to your location! 🌍💰**
