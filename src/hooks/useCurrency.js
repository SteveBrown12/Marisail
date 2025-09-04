import { useState, useEffect, useCallback } from 'react';
import currencyUtils from '../utils/currencyUtils';

/**
 * React hook for currency conversion and exchange rate operations
 * Provides easy access to currency utilities with state management
 */
export const useCurrency = () => {
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Load latest exchange rates for a base currency
   */
  const loadRates = useCallback(async (baseCurrency = 'USD') => {
    try {
      setLoading(true);
      setError(null);
      
      const ratesData = await currencyUtils.getLatestRates(baseCurrency);
      setRates(ratesData.rates || {});
      setLastUpdated(ratesData.lastUpdated);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load rates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Convert amount between currencies
   */
  const convert = useCallback(async (amount, fromCurrency, toCurrency) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await currencyUtils.convertCurrency(amount, fromCurrency, toCurrency);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Currency conversion failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load supported currencies list
   */
  const loadCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currenciesData = await currencyUtils.getSupportedCurrencies();
      setCurrencies(currenciesData.currencies || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load currencies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load user preferences
   */
  const loadUserPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const preferences = await currencyUtils.getUserPreferences();
      setUserPreferences(preferences);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load user preferences:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user preferences
   */
  const updateUserPreferences = useCallback(async (preferences) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await currencyUtils.setUserPreferences(preferences);
      await loadUserPreferences(); // Reload preferences
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to update user preferences:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUserPreferences]);

  /**
   * Get exchange rate for a currency pair
   */
  const getRate = useCallback(async (fromCurrency, toCurrency) => {
    try {
      setError(null);
      
      const result = await currencyUtils.getExchangeRate(fromCurrency, toCurrency);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to get exchange rate:', err);
      throw err;
    }
  }, []);

  /**
   * Format currency amount
   */
  const format = useCallback((amount, currencyCode = 'USD', locale = 'en-US') => {
    return currencyUtils.formatCurrency(amount, currencyCode, locale);
  }, []);

  /**
   * Get currency symbol
   */
  const getSymbol = useCallback((currencyCode) => {
    return currencyUtils.getCurrencySymbol(currencyCode);
  }, []);

  /**
   * Get common currencies by region
   */
  const getCommonByRegion = useCallback(() => {
    return currencyUtils.getCommonCurrenciesByRegion();
  }, []);

  /**
   * Check service health
   */
  const checkHealth = useCallback(async () => {
    try {
      return await currencyUtils.checkHealth();
    } catch (err) {
      console.error('Health check failed:', err);
      return false;
    }
  }, []);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    currencyUtils.clearCache();
  }, []);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    return currencyUtils.getCacheStats();
  }, []);

  /**
   * Initialize currency data
   */
  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load initial data in parallel
      await Promise.all([
        loadRates('USD'),
        loadCurrencies(),
        loadUserPreferences()
      ]);
    } catch (err) {
      setError(err.message);
      console.error('Failed to initialize currency data:', err);
    } finally {
      setLoading(false);
    }
  }, [loadRates, loadCurrencies, loadUserPreferences]);

  /**
   * Refresh all currency data
   */
  const refresh = useCallback(async () => {
    await initialize();
  }, [initialize]);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    // State
    rates,
    currencies,
    userPreferences,
    loading,
    error,
    lastUpdated,
    
    // Actions
    loadRates,
    convert,
    loadCurrencies,
    loadUserPreferences,
    updateUserPreferences,
    getRate,
    format,
    getSymbol,
    getCommonByRegion,
    checkHealth,
    clearCache,
    getCacheStats,
    initialize,
    refresh,
    
    // Utility functions
    isReady: !loading && Object.keys(rates).length > 0,
    hasError: !!error,
    clearError: () => setError(null)
  };
};

export default useCurrency;
