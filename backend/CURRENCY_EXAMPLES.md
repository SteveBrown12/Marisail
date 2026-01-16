# Currency Rounding Examples

Based on your original table showing how £10 equivalent varies across currencies.

## Quick Reference Table

| Country | Code | Currency | Symbol | £10 Equiv | Digits | Rounding Strategy | Example |
|---------|------|----------|--------|-----------|--------|-------------------|---------|
| UK | GB | Pound Sterling | £ | 10.00 | 2 | 2 decimal places | £10.56 → £10.56 |
| Albania | AL | Albanian Lek | L | 1200 | 3 | Nearest 1 | L1200.67 → L1201 |
| Algeria | DZ | Algerian Dinar | DA | 1700 | 4 | Nearest 10 | DA1568 → DA1570 |
| Andorra | AD | Euro | € | 11.70 | 2 | 2 decimal places | €11.23 → €11.23 |
| Angola | AO | Angolan Kwanza | Kz | 10700 | 5 | Nearest 100 | Kz10567 → Kz10600 |
| Argentina | AR | Argentine Peso | $ | 10900 | 5 | Nearest 100 | $10900.45 → $10900 |
| Armenia | AM | Armenian Dram | ֏ | 5100 | 4 | Nearest 10 | ֏3845 → ֏3850 |
| Australia | AU | Australian Dollar | $ | 19.20 | 2 | 2 decimal places | $15.67 → $15.67 |
| Austria | AT | Euro | € | 11.70 | 2 | 2 decimal places | €11.23 → €11.23 |
| Azerbaijan | AZ | Azerbaijani Manat | ₼ | 21.60 | 2 | 2 decimal places | ₼21.89 → ₼21.89 |

## Regional Examples

### Americas
```
USD (United States)    : $10.56    → $10.56    (2 decimals)
CAD (Canada)          : $12.89    → $12.89    (2 decimals)
MXN (Mexico)          : $215.67   → $216      (nearest 1)
BRL (Brazil)          : R$52.34   → R$52      (nearest 1)
ARS (Argentina)       : $10900.45 → $10900    (nearest 100)
CLP (Chile)           : $8567.89  → $8600     (nearest 100)
```

### Europe
```
EUR (Eurozone)        : €11.23    → €11.23    (2 decimals)
GBP (United Kingdom)  : £10.98    → £10.98    (2 decimals)
CHF (Switzerland)     : Fr9.45    → Fr9.45    (2 decimals)
SEK (Sweden)          : kr115.82  → kr116     (nearest 1)
NOK (Norway)          : kr108.45  → kr108     (nearest 1)
HUF (Hungary)         : Ft3845.12 → Ft3850    (nearest 10)
```

### Asia
```
JPY (Japan)           : ¥1568.23  → ¥1570     (nearest 10)
CNY (China)           : ¥75.82    → ¥76       (nearest 1)
KRW (South Korea)     : ₩13567.89 → ₩13600    (nearest 100)
INR (India)           : ₹890.45   → ₹890      (nearest 1)
THB (Thailand)        : ฿356.78   → ฿357      (nearest 1)
IDR (Indonesia)       : Rp165432  → Rp165000  (nearest 1000)
VND (Vietnam)         : ₫254789   → ₫255000   (nearest 1000)
SGD (Singapore)       : $13.67    → $13.67    (2 decimals)
```

### Middle East
```
AED (UAE)             : د.إ36.78  → د.إ36.78  (2 decimals)
SAR (Saudi Arabia)    : ﷼37.45    → ﷼37.45    (2 decimals)
QAR (Qatar)           : ر.ق36.89  → ر.ق36.89  (2 decimals)
ILS (Israel)          : ₪35.67    → ₪35.67    (2 decimals)
LBP (Lebanon)         : ل.ل15234  → ل.ل15200  (nearest 100)
```

### Africa
```
ZAR (South Africa)    : R189.45   → R189      (nearest 1)
NGN (Nigeria)         : ₦13456.23 → ₦13500    (nearest 100)
KES (Kenya)           : KSh1345   → KSh1350   (nearest 10)
EGP (Egypt)           : £312.78   → £313      (nearest 1)
GHS (Ghana)           : ₵56.78    → ₵57       (nearest 1)
TZS (Tanzania)        : TSh25678  → TSh25700  (nearest 100)
```

### Oceania
```
AUD (Australia)       : $15.67    → $15.67    (2 decimals)
NZD (New Zealand)     : $16.89    → $16.89    (2 decimals)
FJD (Fiji)            : $21.45    → $21.45    (2 decimals)
VUV (Vanuatu)         : Vt1234.56 → Vt1230    (nearest 10)
```

## Understanding the Rounding

The rounding is based on the typical magnitude of currency values:

1. **Small amounts (2 digits before decimal):** Like USD, EUR
   - Keep precise to 2 decimal places
   - Example: $10.56 stays $10.56

2. **Medium amounts (3 digits):** Like CNY, INR, MXN
   - Round to whole numbers
   - Example: ¥75.82 becomes ¥76

3. **Larger amounts (4 digits):** Like JPY, HUF
   - Round to nearest 10
   - Example: ¥1568 becomes ¥1570

4. **Very large amounts (5 digits):** Like KRW, ARS
   - Round to nearest 100
   - Example: ₩13,567 becomes ₩13,600

5. **Extremely large amounts (6+ digits):** Like IDR, VND
   - Round to nearest 1000
   - Example: Rp165,432 becomes Rp165,000

This creates user-friendly payment amounts that feel natural in each currency!
