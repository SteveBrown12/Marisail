# Currency-Specific Smart Rounding for Payments

## Overview

This feature implements intelligent rounding for payment amounts based on currency characteristics. Different currencies have different typical value ranges (e.g., $10 USD vs ₩10,000 KRW for similar purchasing power), so they require different rounding strategies.

## How It Works

### Rounding Rules by Currency Digits

Based on the number of digits in a £10 equivalent:

| Digits | Examples | Rounding Strategy | Example |
|--------|----------|-------------------|---------|
| 2 | USD, EUR, GBP, AUD | Round to 2 decimal places | $10.56 → $10.56 |
| 3 | CNY, INR, ALL | Round to nearest 1 | ¥75.82 → ¥76 |
| 4 | JPY, HUF, DZD | Round to nearest 10 | ¥1568 → ¥1570 |
| 5 | KRW, ARS, AOA | Round to nearest 100 | ₩13,567 → ₩13,600 |
| 6+ | IDR, VND | Round to nearest 1000 | Rp165,432 → Rp165,000 |

## Implementation

### Backend Services

#### 1. Exchange Rate Service (`exchangeRateService.js`)

**Key Methods:**

```javascript
// Get currency metadata (digits, symbol, name)
exchangeRateService.getCurrencyMetadata(currencyCode)

// Round amount based on currency
exchangeRateService.roundForPayment(amount, currencyCode)

// Prepare amount for Stripe (handles zero-decimal currencies)
exchangeRateService.prepareAmountForStripe(amount, currencyCode)

// Convert and round in one step
exchangeRateService.convertAndRoundForPayment(amount, fromCurrency, toCurrency)
```

#### 2. Payment Routes (`payment.js`)

All payment endpoints automatically apply smart rounding:
- `/create-payment-intent`
- `/create-apple-pay-intent`
- `/create-google-pay-intent`
- `/paypal/create-order`
- etc.

### New API Endpoints

#### Get Currency Metadata

```bash
GET /api/payment/currency/:code
```

Example:
```bash
curl http://localhost:3000/api/payment/currency/JPY
```

Response:
```json
{
  "currency": "JPY",
  "metadata": {
    "digits": 4,
    "symbol": "¥",
    "name": "Japanese Yen"
  },
  "example": {
    "originalAmount": 10.56,
    "roundedAmount": 10,
    "stripeAmount": 10,
    "description": "For JPY, 10.56 rounds to 10 (Stripe: 10)"
  }
}
```

#### Round Specific Amount

```bash
POST /api/payment/round-amount
Content-Type: application/json

{
  "amount": 1568.23,
  "currency": "JPY"
}
```

Response:
```json
{
  "currency": "JPY",
  "originalAmount": 1568.23,
  "roundedAmount": 1570,
  "stripeAmount": 1570,
  "metadata": {
    "digits": 4,
    "symbol": "¥",
    "name": "Japanese Yen"
  }
}
```

## Usage Examples

### Creating a Payment with Automatic Rounding

```javascript
// Frontend code
const response = await fetch('/api/payment/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1568.23,
    currency: 'jpy',
    metadata: { userId: '123' }
  })
});

const data = await response.json();
console.log(data);
// {
//   clientSecret: "pi_xxx_secret_yyy",
//   paymentIntentId: "pi_xxx",
//   amount: 1570,          // Rounded from 1568.23
//   originalAmount: 1568.23
// }
```

### Manual Rounding

```javascript
import exchangeRateService from './services/exchangeRateService.js';

// Round a USD amount
const usdAmount = exchangeRateService.roundForPayment(10.567, 'USD');
console.log(usdAmount); // 10.57

// Round a JPY amount
const jpyAmount = exchangeRateService.roundForPayment(1568.23, 'JPY');
console.log(jpyAmount); // 1570

// Round a KRW amount
const krwAmount = exchangeRateService.roundForPayment(13567.89, 'KRW');
console.log(krwAmount); // 13600
```

### Currency Conversion with Rounding

```javascript
// Convert $100 USD to JPY with automatic rounding
const result = await exchangeRateService.convertAndRoundForPayment(100, 'USD', 'JPY');
console.log(result);
// {
//   success: true,
//   amount: 100,
//   convertedAmount: 14990,  // Rounded (might be 14987.65 before rounding)
//   originalConvertedAmount: 14987.65,
//   fromCurrency: 'USD',
//   toCurrency: 'JPY',
//   rate: 149.8765,
//   rounded: true,
//   currencyMetadata: { digits: 4, symbol: '¥', name: 'Japanese Yen' }
// }
```

## Supported Currencies

**Global Coverage: 146+ Currencies Worldwide**

The system includes comprehensive coverage across all continents:

### By Region:
- **Americas:** 29 currencies (USD, CAD, MXN, BRL, ARS, CLP, COP, etc.)
- **Europe:** 24 currencies (EUR, GBP, CHF, SEK, NOK, PLN, RUB, etc.)
- **Asia:** 30 currencies (JPY, CNY, KRW, INR, IDR, VND, THB, SGD, etc.)
- **Middle East:** 13 currencies (AED, SAR, QAR, KWD, ILS, etc.)
- **Africa:** 41 currencies (ZAR, NGN, KES, EGP, MAD, GHS, etc.)
- **Oceania:** 9 currencies (AUD, NZD, FJD, PGK, etc.)

### By Digit Count:
- **2 Digits (46 currencies):** USD, EUR, GBP, CAD, AUD, CHF, SGD, SAR, AED, etc.
- **3 Digits (53 currencies):** CNY, INR, MXN, BRL, THB, PHP, ZAR, EGP, etc.
- **4 Digits (19 currencies):** JPY, HUF, ISK, PKR, KES, DZD, KZT, CRC, etc.
- **5 Digits (24 currencies):** KRW, ARS, AOA, CLP, NGN, UGX, TZS, MMK, LBP, etc.
- **6 Digits (4 currencies):** IDR, VND, LAK, IRR

Unknown currencies default to 2-digit rounding.

## Testing

Run the test script to verify rounding behavior:

```bash
cd backend
node test-currency-rounding.js
```

This will test all currency types and show:
- Original amounts
- Rounded amounts
- Stripe-formatted amounts
- Visual confirmation with currency symbols

## Zero-Decimal Currencies

Some currencies (JPY, KRW, VND, etc.) don't use decimal places. The `prepareAmountForStripe()` method handles these specially:

- **Standard currencies (USD, EUR):** Amount × 100 (e.g., $10.50 → 1050 cents)
- **Zero-decimal currencies (JPY, KRW):** Amount as-is (e.g., ¥1570 → 1570)

List of zero-decimal currencies:
`BIF, CLP, DJF, GNF, JPY, KMF, KRW, MGA, PYG, RWF, UGX, VND, VUV, XAF, XOF, XPF`

## Adding New Currencies

To add a new currency, update `exchangeRateService.js`:

```javascript
this.currencyMetadata = {
  // ... existing currencies
  'THB': { digits: 3, symbol: '฿', name: 'Thai Baht' },
};
```

## Benefits

1. **User-Friendly:** Clean, round numbers appropriate for each currency
2. **Consistent:** Same rounding logic across all payment methods
3. **Accurate:** Respects currency conventions and typical value ranges
4. **Transparent:** Shows both original and rounded amounts
5. **Stripe-Compatible:** Properly formats amounts for Stripe API

## Notes

- Rounding is applied **before** creating payment intents
- Original amounts are preserved in metadata for auditing
- All payment responses include both `amount` (rounded) and `originalAmount`
- PayPal and Stripe payments both use the same rounding logic
