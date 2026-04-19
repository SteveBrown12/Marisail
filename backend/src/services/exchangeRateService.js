import axios from 'axios';

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '618a428dd3b2ea6adc05e43b';
const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6';

class ExchangeRateService {
  constructor() {
    this.apiKey = EXCHANGE_RATE_API_KEY;
    this.baseUrl = EXCHANGE_RATE_BASE_URL;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

    // Currency metadata: digits before decimal point for £10 equivalent
    // Used for smart rounding in payments
    // Covers all major countries and currencies worldwide
    this.currencyMetadata = {
      // Americas
      'USD': { digits: 2, symbol: '$', name: 'US Dollar' },
      'CAD': { digits: 2, symbol: '$', name: 'Canadian Dollar' },
      'MXN': { digits: 3, symbol: '$', name: 'Mexican Peso' },
      'BRL': { digits: 3, symbol: 'R$', name: 'Brazilian Real' },
      'ARS': { digits: 5, symbol: '$', name: 'Argentine Peso' },
      'CLP': { digits: 5, symbol: '$', name: 'Chilean Peso' },
      'COP': { digits: 5, symbol: '$', name: 'Colombian Peso' },
      'PEN': { digits: 2, symbol: 'S/', name: 'Peruvian Sol' },
      'UYU': { digits: 3, symbol: '$', name: 'Uruguayan Peso' },
      'VEF': { digits: 2, symbol: 'Bs', name: 'Venezuelan Bolívar' },
      'BOB': { digits: 3, symbol: 'Bs', name: 'Bolivian Boliviano' },
      'PYG': { digits: 5, symbol: '₲', name: 'Paraguayan Guarani' },
      'DOP': { digits: 3, symbol: '$', name: 'Dominican Peso' },
      'CRC': { digits: 4, symbol: '₡', name: 'Costa Rican Colón' },
      'GTQ': { digits: 3, symbol: 'Q', name: 'Guatemalan Quetzal' },
      'HNL': { digits: 3, symbol: 'L', name: 'Honduran Lempira' },
      'NIO': { digits: 3, symbol: 'C$', name: 'Nicaraguan Córdoba' },
      'PAB': { digits: 2, symbol: 'B/.', name: 'Panamanian Balboa' },
      'TTD': { digits: 2, symbol: '$', name: 'Trinidad & Tobago Dollar' },
      'JMD': { digits: 3, symbol: '$', name: 'Jamaican Dollar' },
      'BBD': { digits: 2, symbol: '$', name: 'Barbadian Dollar' },
      'BZD': { digits: 2, symbol: '$', name: 'Belize Dollar' },
      'XCD': { digits: 2, symbol: '$', name: 'East Caribbean Dollar' },
      'HTG': { digits: 3, symbol: 'G', name: 'Haitian Gourde' },
      'BSD': { digits: 2, symbol: '$', name: 'Bahamian Dollar' },
      'CUP': { digits: 3, symbol: '$', name: 'Cuban Peso' },
      'SRD': { digits: 3, symbol: '$', name: 'Surinamese Dollar' },
      'AWG': { digits: 2, symbol: 'ƒ', name: 'Aruban Florin' },
      'KYD': { digits: 2, symbol: '$', name: 'Cayman Islands Dollar' },

      // Europe
      'EUR': { digits: 2, symbol: '€', name: 'Euro' },
      'GBP': { digits: 2, symbol: '£', name: 'Pound Sterling' },
      'CHF': { digits: 2, symbol: 'Fr', name: 'Swiss Franc' },
      'NOK': { digits: 3, symbol: 'kr', name: 'Norwegian Krone' },
      'SEK': { digits: 3, symbol: 'kr', name: 'Swedish Krona' },
      'DKK': { digits: 3, symbol: 'kr', name: 'Danish Krone' },
      'ISK': { digits: 4, symbol: 'kr', name: 'Icelandic Króna' },
      'PLN': { digits: 2, symbol: 'zł', name: 'Polish Zloty' },
      'CZK': { digits: 3, symbol: 'Kč', name: 'Czech Koruna' },
      'HUF': { digits: 4, symbol: 'Ft', name: 'Hungarian Forint' },
      'RON': { digits: 2, symbol: 'lei', name: 'Romanian Leu' },
      'BGN': { digits: 2, symbol: 'лв', name: 'Bulgarian Lev' },
      'HRK': { digits: 3, symbol: 'kn', name: 'Croatian Kuna' },
      'RSD': { digits: 3, symbol: 'дин', name: 'Serbian Dinar' },
      'UAH': { digits: 3, symbol: '₴', name: 'Ukrainian Hryvnia' },
      'RUB': { digits: 3, symbol: '₽', name: 'Russian Ruble' },
      'BYN': { digits: 2, symbol: 'Br', name: 'Belarusian Ruble' },
      'MDL': { digits: 2, symbol: 'L', name: 'Moldovan Leu' },
      'BAM': { digits: 2, symbol: 'KM', name: 'Bosnia-Herzegovina Convertible Mark' },
      'MKD': { digits: 3, symbol: 'ден', name: 'Macedonian Denar' },
      'ALL': { digits: 3, symbol: 'L', name: 'Albanian Lek' },
      'TRY': { digits: 3, symbol: '₺', name: 'Turkish Lira' },
      'GEL': { digits: 2, symbol: '₾', name: 'Georgian Lari' },
      'AMD': { digits: 4, symbol: '֏', name: 'Armenian Dram' },
      'AZN': { digits: 2, symbol: '₼', name: 'Azerbaijani Manat' },

      // Asia
      'JPY': { digits: 4, symbol: '¥', name: 'Japanese Yen' },
      'CNY': { digits: 3, symbol: '¥', name: 'Chinese Yuan' },
      'KRW': { digits: 5, symbol: '₩', name: 'South Korean Won' },
      'INR': { digits: 3, symbol: '₹', name: 'Indian Rupee' },
      'IDR': { digits: 6, symbol: 'Rp', name: 'Indonesian Rupiah' },
      'THB': { digits: 3, symbol: '฿', name: 'Thai Baht' },
      'MYR': { digits: 2, symbol: 'RM', name: 'Malaysian Ringgit' },
      'SGD': { digits: 2, symbol: '$', name: 'Singapore Dollar' },
      'PHP': { digits: 3, symbol: '₱', name: 'Philippine Peso' },
      'VND': { digits: 6, symbol: '₫', name: 'Vietnamese Dong' },
      'TWD': { digits: 3, symbol: 'NT$', name: 'Taiwan Dollar' },
      'HKD': { digits: 3, symbol: '$', name: 'Hong Kong Dollar' },
      'PKR': { digits: 4, symbol: '₨', name: 'Pakistani Rupee' },
      'BDT': { digits: 4, symbol: '৳', name: 'Bangladeshi Taka' },
      'LKR': { digits: 4, symbol: 'Rs', name: 'Sri Lankan Rupee' },
      'NPR': { digits: 4, symbol: 'Rs', name: 'Nepalese Rupee' },
      'MMK': { digits: 5, symbol: 'K', name: 'Myanmar Kyat' },
      'KHR': { digits: 5, symbol: '៛', name: 'Cambodian Riel' },
      'LAK': { digits: 6, symbol: '₭', name: 'Lao Kip' },
      'BND': { digits: 2, symbol: '$', name: 'Brunei Dollar' },
      'MOP': { digits: 3, symbol: 'MOP$', name: 'Macanese Pataca' },
      'MVR': { digits: 2, symbol: 'Rf', name: 'Maldivian Rufiyaa' },
      'AFN': { digits: 3, symbol: '؋', name: 'Afghan Afghani' },
      'KZT': { digits: 4, symbol: '₸', name: 'Kazakhstani Tenge' },
      'UZS': { digits: 5, symbol: 'сўм', name: 'Uzbekistani Som' },
      'KGS': { digits: 3, symbol: 'с', name: 'Kyrgyzstani Som' },
      'TJS': { digits: 3, symbol: 'ЅМ', name: 'Tajikistani Somoni' },
      'TMT': { digits: 2, symbol: 'm', name: 'Turkmenistani Manat' },
      'MNT': { digits: 5, symbol: '₮', name: 'Mongolian Tugrik' },
      'BTC': { digits: 2, symbol: '฿', name: 'Bhutanese Ngultrum' },

      // Middle East
      'SAR': { digits: 2, symbol: '﷼', name: 'Saudi Riyal' },
      'AED': { digits: 2, symbol: 'د.إ', name: 'UAE Dirham' },
      'QAR': { digits: 2, symbol: 'ر.ق', name: 'Qatari Riyal' },
      'KWD': { digits: 2, symbol: 'د.ك', name: 'Kuwaiti Dinar' },
      'BHD': { digits: 2, symbol: 'د.ب', name: 'Bahraini Dinar' },
      'OMR': { digits: 2, symbol: 'ر.ع.', name: 'Omani Rial' },
      'JOD': { digits: 2, symbol: 'د.ا', name: 'Jordanian Dinar' },
      'ILS': { digits: 2, symbol: '₪', name: 'Israeli Shekel' },
      'LBP': { digits: 5, symbol: 'ل.ل', name: 'Lebanese Pound' },
      'SYP': { digits: 5, symbol: '£', name: 'Syrian Pound' },
      'IQD': { digits: 5, symbol: 'ع.د', name: 'Iraqi Dinar' },
      'IRR': { digits: 6, symbol: '﷼', name: 'Iranian Rial' },
      'YER': { digits: 4, symbol: '﷼', name: 'Yemeni Rial' },

      // Africa
      'ZAR': { digits: 3, symbol: 'R', name: 'South African Rand' },
      'EGP': { digits: 3, symbol: '£', name: 'Egyptian Pound' },
      'NGN': { digits: 5, symbol: '₦', name: 'Nigerian Naira' },
      'KES': { digits: 4, symbol: 'KSh', name: 'Kenyan Shilling' },
      'GHS': { digits: 3, symbol: '₵', name: 'Ghanaian Cedi' },
      'TZS': { digits: 5, symbol: 'TSh', name: 'Tanzanian Shilling' },
      'UGX': { digits: 5, symbol: 'USh', name: 'Ugandan Shilling' },
      'ETB': { digits: 3, symbol: 'Br', name: 'Ethiopian Birr' },
      'MAD': { digits: 3, symbol: 'د.م.', name: 'Moroccan Dirham' },
      'DZD': { digits: 4, symbol: 'د.ج', name: 'Algerian Dinar' },
      'TND': { digits: 2, symbol: 'د.ت', name: 'Tunisian Dinar' },
      'LYD': { digits: 2, symbol: 'ل.د', name: 'Libyan Dinar' },
      'AOA': { digits: 5, symbol: 'Kz', name: 'Angolan Kwanza' },
      'MZN': { digits: 3, symbol: 'MT', name: 'Mozambican Metical' },
      'ZMW': { digits: 3, symbol: 'K', name: 'Zambian Kwacha' },
      'BWP': { digits: 3, symbol: 'P', name: 'Botswana Pula' },
      'NAD': { digits: 3, symbol: '$', name: 'Namibian Dollar' },
      'SZL': { digits: 3, symbol: 'L', name: 'Swazi Lilangeni' },
      'LSL': { digits: 3, symbol: 'L', name: 'Lesotho Loti' },
      'MWK': { digits: 5, symbol: 'MK', name: 'Malawian Kwacha' },
      'RWF': { digits: 5, symbol: 'FRw', name: 'Rwandan Franc' },
      'BIF': { digits: 5, symbol: 'FBu', name: 'Burundian Franc' },
      'DJF': { digits: 4, symbol: 'Fdj', name: 'Djiboutian Franc' },
      'SOS': { digits: 5, symbol: 'Sh', name: 'Somali Shilling' },
      'SDG': { digits: 3, symbol: 'ج.س.', name: 'Sudanese Pound' },
      'SSP': { digits: 3, symbol: '£', name: 'South Sudanese Pound' },
      'MUR': { digits: 3, symbol: '₨', name: 'Mauritian Rupee' },
      'SCR': { digits: 3, symbol: '₨', name: 'Seychellois Rupee' },
      'MGA': { digits: 5, symbol: 'Ar', name: 'Malagasy Ariary' },
      'KMF': { digits: 4, symbol: 'CF', name: 'Comorian Franc' },
      'CDF': { digits: 5, symbol: 'FC', name: 'Congolese Franc' },
      'XOF': { digits: 4, symbol: 'CFA', name: 'West African CFA Franc' },
      'XAF': { digits: 4, symbol: 'FCFA', name: 'Central African CFA Franc' },
      'GMD': { digits: 3, symbol: 'D', name: 'Gambian Dalasi' },
      'GNF': { digits: 5, symbol: 'FG', name: 'Guinean Franc' },
      'LRD': { digits: 3, symbol: '$', name: 'Liberian Dollar' },
      'SLL': { digits: 5, symbol: 'Le', name: 'Sierra Leonean Leone' },
      'CVE': { digits: 3, symbol: '$', name: 'Cape Verdean Escudo' },
      'STN': { digits: 3, symbol: 'Db', name: 'São Tomé & Príncipe Dobra' },
      'MRU': { digits: 3, symbol: 'UM', name: 'Mauritanian Ouguiya' },

      // Oceania
      'AUD': { digits: 2, symbol: '$', name: 'Australian Dollar' },
      'NZD': { digits: 2, symbol: '$', name: 'New Zealand Dollar' },
      'FJD': { digits: 2, symbol: '$', name: 'Fijian Dollar' },
      'PGK': { digits: 2, symbol: 'K', name: 'Papua New Guinean Kina' },
      'WST': { digits: 2, symbol: 'T', name: 'Samoan Tala' },
      'TOP': { digits: 2, symbol: 'T$', name: 'Tongan Paʻanga' },
      'VUV': { digits: 4, symbol: 'Vt', name: 'Vanuatu Vatu' },
      'SBD': { digits: 2, symbol: '$', name: 'Solomon Islands Dollar' },
      'XPF': { digits: 4, symbol: '₣', name: 'CFP Franc' },
    };
  }

  /**
   * Get latest exchange rates for a base currency
   * @param {string} baseCurrency - Base currency code (e.g., 'USD', 'EUR')
   * @returns {Promise<Object>} Exchange rates data
   */
  async getLatestRates(baseCurrency = 'USD') {
    try {
      const cacheKey = `latest_${baseCurrency}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`);
      
      if (response.data && response.data.result === 'success') {
        const ratesData = {
          baseCurrency: response.data.base_code,
          lastUpdated: response.data.time_last_update_utc,
          rates: response.data.conversion_rates,
          success: true
        };
        
        this.setCache(cacheKey, ratesData);
        return ratesData;
      } else {
        throw new Error('Failed to fetch exchange rates');
      }
    } catch (error) {
      console.error('Exchange rate API error:', error.message);
      return {
        success: false,
        error: error.message,
        baseCurrency,
        rates: {}
      };
    }
  }

  /**
   * Convert amount from one currency to another
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency code
   * @param {string} toCurrency - Target currency code
   * @returns {Promise<Object>} Conversion result
   */
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      if (fromCurrency === toCurrency) {
        return {
          success: true,
          amount: amount,
          convertedAmount: amount,
          fromCurrency,
          toCurrency,
          rate: 1,
          timestamp: new Date().toISOString()
        };
      }

      const ratesData = await this.getLatestRates(fromCurrency);
      
      if (!ratesData.success) {
        throw new Error('Failed to get exchange rates');
      }

      const rate = ratesData.rates[toCurrency];
      if (!rate) {
        throw new Error(`Exchange rate not available for ${toCurrency}`);
      }

      const convertedAmount = amount * rate;

      return {
        success: true,
        amount: amount,
        convertedAmount: convertedAmount,
        fromCurrency,
        toCurrency,
        rate: rate,
        timestamp: ratesData.lastUpdated
      };
    } catch (error) {
      console.error('Currency conversion error:', error.message);
      return {
        success: false,
        error: error.message,
        amount,
        fromCurrency,
        toCurrency
      };
    }
  }

  /**
   * Get supported currencies list
   * @returns {Promise<Object>} Supported currencies
   */
  async getSupportedCurrencies() {
    try {
      const cacheKey = 'supported_currencies';
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/${this.apiKey}/codes`);
      
      if (response.data && response.data.result === 'success') {
        const currenciesData = {
          success: true,
          currencies: response.data.supported_codes.map(([code, name]) => ({
            code,
            name
          })),
          timestamp: new Date().toISOString()
        };
        
        this.setCache(cacheKey, currenciesData);
        return currenciesData;
      } else {
        throw new Error('Failed to fetch supported currencies');
      }
    } catch (error) {
      console.error('Supported currencies API error:', error.message);
      return {
        success: false,
        error: error.message,
        currencies: []
      };
    }
  }

  /**
   * Get exchange rate for specific currency pair
   * @param {string} fromCurrency - Source currency code
   * @param {string} toCurrency - Target currency code
   * @returns {Promise<Object>} Exchange rate data
   */
  async getExchangeRate(fromCurrency, toCurrency) {
    try {
      if (fromCurrency === toCurrency) {
        return {
          success: true,
          fromCurrency,
          toCurrency,
          rate: 1,
          timestamp: new Date().toISOString()
        };
      }

      const ratesData = await this.getLatestRates(fromCurrency);
      
      if (!ratesData.success) {
        throw new Error('Failed to get exchange rates');
      }

      const rate = ratesData.rates[toCurrency];
      if (!rate) {
        throw new Error(`Exchange rate not available for ${toCurrency}`);
      }

      return {
        success: true,
        fromCurrency,
        toCurrency,
        rate: rate,
        timestamp: ratesData.lastUpdated
      };
    } catch (error) {
      console.error('Exchange rate fetch error:', error.message);
      return {
        success: false,
        error: error.message,
        fromCurrency,
        toCurrency
      };
    }
  }

  /**
   * Get cached data if not expired
   * @param {string} key - Cache key
   * @returns {Object|null} Cached data or null if expired/missing
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  /**
   * Set data in cache with timestamp
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get user's preferred currency based on region (placeholder for Google Maps integration)
   * @param {Object} locationData - Location data from Google Maps API
   * @returns {Promise<string>} Preferred currency code
   */
  async getUserPreferredCurrency(locationData = null) {
    // TODO: Implement when Google Maps API is integrated
    // This will use locationData to determine user's country/region
    // and return the appropriate currency code
    
    if (locationData) {
      // Example implementation:
      // const countryCode = locationData.country_code;
      // const currencyMap = {
      //   'US': 'USD',
      //   'GB': 'GBP',
      //   'EU': 'EUR',
      //   // ... more mappings
      // };
      // return currencyMap[countryCode] || 'USD';
    }
    
    // Default to USD for now
    return 'USD';
  }

  /**
   * Get common currencies for a region (placeholder for Google Maps integration)
   * @param {Object} locationData - Location data from Google Maps API
   * @returns {Promise<Array>} Array of common currency codes for the region
   */
  async getCommonCurrenciesForRegion(locationData = null) {
    // TODO: Implement when Google Maps API is integrated
    // This will return common currencies used in the user's region

    if (locationData) {
      // Example implementation:
      // const region = locationData.region;
      // const regionCurrencies = {
      //   'North America': ['USD', 'CAD', 'MXN'],
      //   'Europe': ['EUR', 'GBP', 'CHF', 'SEK'],
      //   'Asia': ['JPY', 'CNY', 'KRW', 'INR'],
      //   // ... more regions
      // };
      // return regionCurrencies[region] || ['USD'];
    }

    // Default common currencies
    return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  }

  /**
   * Get currency metadata (digits, symbol, name)
   * @param {string} currencyCode - Currency code (e.g., 'USD', 'JPY')
   * @returns {Object} Currency metadata or default for unknown currencies
   */
  getCurrencyMetadata(currencyCode) {
    return this.currencyMetadata[currencyCode] || {
      digits: 2,
      symbol: currencyCode,
      name: currencyCode
    };
  }

  /**
   * Smart rounding for payment amounts based on currency characteristics
   * Different currencies use different rounding strategies based on their typical values:
   * - 2 digits (USD, EUR, GBP): Round to 2 decimal places (e.g., $10.00)
   * - 3 digits (ALL, CNY, INR): Round to nearest 1 (e.g., ¥100)
   * - 4 digits (JPY, DZD, HUF): Round to nearest 10 (e.g., ¥1000)
   * - 5 digits (KRW, ARS, AOA): Round to nearest 100 (e.g., ₩10000)
   * - 6+ digits (IDR, VND): Round to nearest 1000 (e.g., Rp100000)
   *
   * @param {number} amount - Amount to round
   * @param {string} currencyCode - Currency code (e.g., 'USD', 'JPY')
   * @returns {number} Rounded amount appropriate for the currency
   */
  roundForPayment(amount, currencyCode) {
    const metadata = this.getCurrencyMetadata(currencyCode);
    const digits = metadata.digits;

    if (digits === 2) {
      // Standard currencies: round to 2 decimal places
      return Math.round(amount * 100) / 100;
    } else if (digits === 3) {
      // Medium value currencies: round to nearest whole number
      return Math.round(amount);
    } else if (digits === 4) {
      // Higher value currencies: round to nearest 10
      return Math.round(amount / 10) * 10;
    } else if (digits === 5) {
      // Very high value currencies: round to nearest 100
      return Math.round(amount / 100) * 100;
    } else if (digits >= 6) {
      // Extremely high value currencies: round to nearest 1000
      return Math.round(amount / 1000) * 1000;
    }

    // Default: round to 2 decimal places
    return Math.round(amount * 100) / 100;
  }

  /**
   * Convert and round amount for payment
   * Combines currency conversion with smart rounding
   *
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency code
   * @param {string} toCurrency - Target currency code
   * @returns {Promise<Object>} Conversion result with rounded amount
   */
  async convertAndRoundForPayment(amount, fromCurrency, toCurrency) {
    const conversionResult = await this.convertCurrency(amount, fromCurrency, toCurrency);

    if (!conversionResult.success) {
      return conversionResult;
    }

    const roundedAmount = this.roundForPayment(conversionResult.convertedAmount, toCurrency);

    return {
      ...conversionResult,
      convertedAmount: roundedAmount,
      originalConvertedAmount: conversionResult.convertedAmount,
      rounded: true,
      currencyMetadata: this.getCurrencyMetadata(toCurrency)
    };
  }

  /**
   * Prepare amount for Stripe payment processing
   * Stripe requires amounts in the currency's smallest unit (cents for USD, yen for JPY, etc.)
   * Zero-decimal currencies don't multiply by 100
   *
   * @param {number} amount - Amount to prepare
   * @param {string} currencyCode - Currency code
   * @returns {number} Amount in smallest currency unit for Stripe
   */
  prepareAmountForStripe(amount, currencyCode) {
    // Zero-decimal currencies: these don't have cents/subunits
    // Stripe accepts them as-is (e.g., 1000 JPY, not 100000)
    const zeroDecimalCurrencies = [
      'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
      'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
    ];

    const isZeroDecimal = zeroDecimalCurrencies.includes(currencyCode.toUpperCase());

    if (isZeroDecimal) {
      // For zero-decimal currencies, round to whole number
      return Math.round(amount);
    } else {
      // For standard currencies, multiply by 100 to get cents
      return Math.round(amount * 100);
    }
  }
}

export default new ExchangeRateService();
