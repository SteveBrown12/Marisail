import exchangeRateService from './src/services/exchangeRateService.js';

console.log('\n🌍 Global Currency-Specific Rounding Test\n');
console.log('=' .repeat(80));

// Count currencies by region
const allCurrencies = Object.keys(exchangeRateService.currencyMetadata);
console.log(`\n✅ Total currencies supported: ${allCurrencies.length}\n`);

// Group by digits
const byDigits = {};
allCurrencies.forEach(code => {
  const metadata = exchangeRateService.getCurrencyMetadata(code);
  if (!byDigits[metadata.digits]) byDigits[metadata.digits] = [];
  byDigits[metadata.digits].push(code);
});

console.log('📊 Coverage by digit count:');
Object.keys(byDigits).sort().forEach(digits => {
  console.log(`   ${digits} digits: ${byDigits[digits].length} currencies`);
});
console.log('');

// Test cases: different currencies with various digit counts from all regions
const testCases = [
  // Americas (2 digits)
  { region: 'Americas', currency: 'USD', amount: 10.56, expected: 10.56 },
  { region: 'Americas', currency: 'CAD', amount: 12.89, expected: 12.89 },

  // Americas (3 digits)
  { region: 'Americas', currency: 'MXN', amount: 215.67, expected: 216 },
  { region: 'Americas', currency: 'BRL', amount: 52.34, expected: 52 },

  // Americas (5 digits)
  { region: 'Americas', currency: 'ARS', amount: 10900.45, expected: 10900 },
  { region: 'Americas', currency: 'CLP', amount: 8567.89, expected: 8600 },

  // Europe (2 digits)
  { region: 'Europe', currency: 'EUR', amount: 11.23, expected: 11.23 },
  { region: 'Europe', currency: 'GBP', amount: 10.98, expected: 10.98 },
  { region: 'Europe', currency: 'CHF', amount: 9.45, expected: 9.45 },

  // Europe (3 digits)
  { region: 'Europe', currency: 'SEK', amount: 115.82, expected: 116 },
  { region: 'Europe', currency: 'NOK', amount: 108.45, expected: 108 },

  // Europe (4 digits)
  { region: 'Europe', currency: 'HUF', amount: 3845.12, expected: 3850 },
  { region: 'Europe', currency: 'ISK', amount: 1432.67, expected: 1430 },

  // Asia (2 digits)
  { region: 'Asia', currency: 'SGD', amount: 13.67, expected: 13.67 },
  { region: 'Asia', currency: 'MYR', amount: 47.23, expected: 47.23 },

  // Asia (3 digits)
  { region: 'Asia', currency: 'CNY', amount: 75.82, expected: 76 },
  { region: 'Asia', currency: 'INR', amount: 890.45, expected: 890 },
  { region: 'Asia', currency: 'THB', amount: 356.78, expected: 357 },

  // Asia (4 digits)
  { region: 'Asia', currency: 'JPY', amount: 1568.23, expected: 1570 },
  { region: 'Asia', currency: 'PKR', amount: 2845.67, expected: 2850 },

  // Asia (5 digits)
  { region: 'Asia', currency: 'KRW', amount: 13567.89, expected: 13600 },
  { region: 'Asia', currency: 'MMK', amount: 21345.12, expected: 21300 },

  // Asia (6 digits)
  { region: 'Asia', currency: 'IDR', amount: 165432.67, expected: 165000 },
  { region: 'Asia', currency: 'VND', amount: 254789.23, expected: 255000 },
  { region: 'Asia', currency: 'LAK', amount: 187654.89, expected: 188000 },

  // Middle East (2 digits)
  { region: 'Middle East', currency: 'AED', amount: 36.78, expected: 36.78 },
  { region: 'Middle East', currency: 'SAR', amount: 37.45, expected: 37.45 },

  // Middle East (5 digits)
  { region: 'Middle East', currency: 'LBP', amount: 15234.67, expected: 15200 },

  // Africa (3 digits)
  { region: 'Africa', currency: 'ZAR', amount: 189.45, expected: 189 },
  { region: 'Africa', currency: 'EGP', amount: 312.78, expected: 313 },

  // Africa (4 digits)
  { region: 'Africa', currency: 'KES', amount: 1345.89, expected: 1350 },
  { region: 'Africa', currency: 'DZD', amount: 1700.88, expected: 1700 },

  // Africa (5 digits)
  { region: 'Africa', currency: 'NGN', amount: 13456.23, expected: 13500 },
  { region: 'Africa', currency: 'UGX', amount: 37812.67, expected: 37800 },
  { region: 'Africa', currency: 'TZS', amount: 25678.45, expected: 25700 },

  // Oceania (2 digits)
  { region: 'Oceania', currency: 'AUD', amount: 15.67, expected: 15.67 },
  { region: 'Oceania', currency: 'NZD', amount: 16.89, expected: 16.89 },

  // Oceania (4 digits)
  { region: 'Oceania', currency: 'VUV', amount: 1234.56, expected: 1230 },
];

console.log('\n📊 Regional Rounding Tests:\n');

let currentRegion = '';
let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach(({ region, currency, amount, expected }) => {
  if (region !== currentRegion) {
    if (currentRegion) console.log('');
    console.log(`\n${region}:`);
    console.log('-'.repeat(40));
    currentRegion = region;
  }

  const metadata = exchangeRateService.getCurrencyMetadata(currency);
  const rounded = exchangeRateService.roundForPayment(amount, currency);
  const stripeAmount = exchangeRateService.prepareAmountForStripe(rounded, currency);
  const passed = rounded === expected;
  if (passed) passedTests++;

  const status = passed ? '✅' : '❌';
  console.log(`${status} ${currency} (${metadata.digits}d): ${metadata.symbol}${amount} → ${metadata.symbol}${rounded} (Stripe: ${stripeAmount})`);
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ Tests passed: ${passedTests}/${totalTests}\n`);

console.log('=' .repeat(80));
console.log('\n💡 Rounding Rules:\n');
console.log('  • 2 digits (USD, EUR, GBP):     Round to 2 decimal places');
console.log('  • 3 digits (CNY, INR, ALL):     Round to nearest 1');
console.log('  • 4 digits (JPY, HUF, DZD):     Round to nearest 10');
console.log('  • 5 digits (KRW, ARS, AOA):     Round to nearest 100');
console.log('  • 6+ digits (IDR, VND):         Round to nearest 1000\n');

console.log('=' .repeat(80));
console.log('\n🧪 API Endpoints Available:\n');
console.log('  GET  /api/payment/currency/:code     - Get currency metadata and examples');
console.log('  POST /api/payment/round-amount       - Round a specific amount');
console.log('       Body: { amount: number, currency: string }\n');

console.log('=' .repeat(80));
console.log('\n📝 Example API Usage:\n');
console.log('  curl http://localhost:3000/api/payment/currency/JPY');
console.log('  curl http://localhost:3000/api/payment/currency/USD');
console.log('  curl -X POST http://localhost:3000/api/payment/round-amount \\');
console.log('       -H "Content-Type: application/json" \\');
console.log('       -d \'{"amount": 1568.23, "currency": "JPY"}\'\n');

console.log('=' .repeat(80));
