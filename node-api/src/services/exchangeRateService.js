import axios from 'axios';

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '618a428dd3b2ea6adc05e43b';
const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6';

class ExchangeRateService {
  constructor() {
    this.apiKey = EXCHANGE_RATE_API_KEY;
    this.baseUrl = EXCHANGE_RATE_BASE_URL;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
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
}

export default new ExchangeRateService();
