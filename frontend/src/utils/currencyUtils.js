import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Currency conversion utility class
 * Handles all currency-related operations including exchange rates and conversions
 */
class CurrencyUtils {
  constructor() {
    this.baseUrl = `${BACKEND_URL}/api/exchange-rate`;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get latest exchange rates for a base currency
   * @param {string} baseCurrency - Base currency code (e.g., 'USD', 'EUR')
   * @returns {Promise<Object>} Exchange rates data
   */
  async getLatestRates(baseCurrency = 'USD') {
    try {
      const cacheKey = `rates_${baseCurrency}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/latest/${baseCurrency}`);
      
      if (response.data.success) {
        this.setCache(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch exchange rates');
      }
    } catch (error) {
      console.error('Failed to get latest rates:', error);
      throw error;
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

      const response = await axios.get(`${this.baseUrl}/convert`, {
        params: { amount, from: fromCurrency, to: toCurrency }
      });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Currency conversion failed:', error);
      throw error;
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

      const response = await axios.get(`${this.baseUrl}/rate/${fromCurrency}/${toCurrency}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to get exchange rate');
      }
    } catch (error) {
      console.error('Failed to get exchange rate:', error);
      throw error;
    }
  }

  /**
   * Get list of supported currencies
   * @returns {Promise<Object>} Supported currencies list
   */
  async getSupportedCurrencies() {
    try {
      const cacheKey = 'supported_currencies';
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/currencies`);
      
      if (response.data.success) {
        this.setCache(cacheKey, response.data);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch supported currencies');
      }
    } catch (error) {
      console.error('Failed to get supported currencies:', error);
      throw error;
    }
  }

  /**
   * Get user's preferred currency and common currencies for their region
   * @returns {Promise<Object>} User preferences data
   */
  async getUserPreferences() {
    try {
      const response = await axios.get(`${this.baseUrl}/user-preferences`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to get user preferences');
      }
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw error;
    }
  }

  /**
   * Set user's preferred currency and location
   * @param {Object} preferences - User preferences object
   * @returns {Promise<Object>} Update result
   */
  async setUserPreferences(preferences) {
    try {
      const response = await axios.post(`${this.baseUrl}/user-preferences`, preferences);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to set user preferences');
      }
    } catch (error) {
      console.error('Failed to set user preferences:', error);
      throw error;
    }
  }

  /**
   * Format currency amount with proper symbol and formatting
   * @param {number} amount - Amount to format
   * @param {string} currencyCode - Currency code (e.g., 'USD', 'EUR')
   * @param {string} locale - Locale for formatting (e.g., 'en-US', 'de-DE')
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting failed:', error);
      // Fallback formatting
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  }

  /**
   * Get currency symbol for a currency code
   * @param {string} currencyCode - Currency code
   * @returns {string} Currency symbol
   */
  getCurrencySymbol(currencyCode) {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹',
      'KRW': '₩',
      'BRL': 'R$',
      'MXN': '$',
      'SGD': 'S$',
      'HKD': 'HK$',
      'NZD': 'NZ$',
      'SEK': 'kr',
      'NOK': 'kr',
      'DKK': 'kr',
      'PLN': 'zł',
      'CZK': 'Kč'
    };
    
    return symbols[currencyCode] || currencyCode;
  }

  /**
   * Get common currencies for different regions
   * @returns {Object} Common currencies by region
   */
  getCommonCurrenciesByRegion() {
    return {
      'North America': ['USD', 'CAD', 'MXN'],
      'Europe': ['EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK'],
      'Asia Pacific': ['JPY', 'CNY', 'KRW', 'INR', 'SGD', 'HKD', 'AUD', 'NZD'],
      'Latin America': ['BRL', 'MXN', 'ARS', 'CLP', 'COP'],
      'Middle East': ['AED', 'SAR', 'ILS', 'TRY', 'EGP'],
      'Africa': ['ZAR', 'NGN', 'KES', 'GHS', 'UGX']
    };
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
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    let expiredEntries = 0;
    let validEntries = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      cacheExpiry: this.cacheExpiry
    };
  }

  /**
   * Check if the exchange rate service is healthy
   * @returns {Promise<boolean>} Service health status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const currencyUtils = new CurrencyUtils();
export default currencyUtils;

// Also export individual functions for convenience
export const {
  getLatestRates,
  convertCurrency,
  getExchangeRate,
  getSupportedCurrencies,
  getUserPreferences,
  setUserPreferences,
  formatCurrency,
  getCurrencySymbol,
  getCommonCurrenciesByRegion,
  checkHealth
} = currencyUtils;
