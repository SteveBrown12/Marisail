import express from 'express';
import exchangeRateService from '../services/exchangeRateService.js';

const router = express.Router();

/**
 * @route GET /api/exchange-rate/health
 * @desc Check exchange rate service health
 * @access Public
 */
router.get('/health', async (req, res) => {
  try {
    const healthCheck = await exchangeRateService.getLatestRates('USD');
    res.json({
      status: 'healthy',
      service: 'Exchange Rate API',
      timestamp: new Date().toISOString(),
      lastUpdate: healthCheck.lastUpdated || 'N/A',
      success: healthCheck.success
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'Exchange Rate API',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/exchange-rate/latest/:baseCurrency?
 * @desc Get latest exchange rates for a base currency
 * @access Public
 */
router.get('/latest/:baseCurrency?', async (req, res) => {
  try {
    const { baseCurrency = 'USD' } = req.params;
    
    if (baseCurrency && typeof baseCurrency !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Base currency must be a string'
      });
    }

    const rates = await exchangeRateService.getLatestRates(baseCurrency.toUpperCase());
    
    if (rates.success) {
      res.json(rates);
    } else {
      res.status(400).json(rates);
    }
  } catch (error) {
    console.error('Latest rates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest exchange rates',
      details: error.message
    });
  }
});

/**
 * @route GET /api/exchange-rate/convert
 * @desc Convert amount from one currency to another
 * @access Public
 */
router.get('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.query;
    
    // Validate required parameters
    if (!amount || !from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: amount, from, to'
      });
    }

    // Validate amount is a number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number'
      });
    }

    // Validate currency codes
    if (typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Currency codes must be strings'
      });
    }

    const conversion = await exchangeRateService.convertCurrency(
      numAmount,
      from.toUpperCase(),
      to.toUpperCase()
    );

    if (conversion.success) {
      res.json(conversion);
    } else {
      res.status(400).json(conversion);
    }
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to convert currency',
      details: error.message
    });
  }
});

/**
 * @route GET /api/exchange-rate/rate/:from/:to
 * @desc Get exchange rate for specific currency pair
 * @access Public
 */
router.get('/rate/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: from, to'
      });
    }

    if (typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Currency codes must be strings'
      });
    }

    const rate = await exchangeRateService.getExchangeRate(
      from.toUpperCase(),
      to.toUpperCase()
    );

    if (rate.success) {
      res.json(rate);
    } else {
      res.status(400).json(rate);
    }
  } catch (error) {
    console.error('Exchange rate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get exchange rate',
      details: error.message
    });
  }
});

/**
 * @route GET /api/exchange-rate/currencies
 * @desc Get list of supported currencies
 * @access Public
 */
router.get('/currencies', async (req, res) => {
  try {
    const currencies = await exchangeRateService.getSupportedCurrencies();
    
    if (currencies.success) {
      res.json(currencies);
    } else {
      res.status(400).json(currencies);
    }
  } catch (error) {
    console.error('Supported currencies error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported currencies',
      details: error.message
    });
  }
});

/**
 * @route GET /api/exchange-rate/user-preferences
 * @desc Get user's preferred currency based on location (placeholder for Google Maps integration)
 * @access Public
 */
router.get('/user-preferences', async (req, res) => {
  try {
    // TODO: When Google Maps API is integrated, get location from request
    // const locationData = req.body.location || req.query.location;
    
    const preferredCurrency = await exchangeRateService.getUserPreferredCurrency();
    const commonCurrencies = await exchangeRateService.getCommonCurrenciesForRegion();
    
    res.json({
      success: true,
      preferredCurrency,
      commonCurrencies,
      timestamp: new Date().toISOString(),
      note: 'Location-based preferences will be available when Google Maps API is integrated'
    });
  } catch (error) {
    console.error('User preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user preferences',
      details: error.message
    });
  }
});

/**
 * @route POST /api/exchange-rate/user-preferences
 * @desc Set user's preferred currency and location (placeholder for Google Maps integration)
 * @access Public
 */
router.post('/user-preferences', async (req, res) => {
  try {
    const { location, preferredCurrency } = req.body;
    
    // TODO: When Google Maps API is integrated, validate and process location data
    // For now, just return a placeholder response
    
    res.json({
      success: true,
      message: 'User preferences updated successfully',
      note: 'Location-based preferences will be fully functional when Google Maps API is integrated',
      timestamp: new Date().toISOString(),
      data: {
        location: location || 'Not provided',
        preferredCurrency: preferredCurrency || 'USD'
      }
    });
  } catch (error) {
    console.error('Set user preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set user preferences',
      details: error.message
    });
  }
});

/**
 * @route GET /api/exchange-rate/cache/clear
 * @desc Clear expired cache entries
 * @access Public
 */
router.get('/cache/clear', async (req, res) => {
  try {
    exchangeRateService.clearExpiredCache();
    res.json({
      success: true,
      message: 'Expired cache entries cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      details: error.message
    });
  }
});

/**
 * @route GET /api/exchange-rate/cache/status
 * @desc Get cache status and statistics
 * @access Public
 */
router.get('/cache/status', async (req, res) => {
  try {
    const cacheSize = exchangeRateService.cache.size;
    const now = Date.now();
    let expiredEntries = 0;
    let validEntries = 0;
    
    for (const [key, value] of exchangeRateService.cache.entries()) {
      if (now - value.timestamp > exchangeRateService.cacheExpiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }
    
    res.json({
      success: true,
      cacheSize,
      validEntries,
      expiredEntries,
      cacheExpiry: exchangeRateService.cacheExpiry,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache status',
      details: error.message
    });
  }
});

export default router;
