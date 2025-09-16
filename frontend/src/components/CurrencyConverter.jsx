import React, { useState, useEffect } from 'react';
import useCurrency from '../hooks/useCurrency';
import Loader from './Loader';

const CurrencyConverter = () => {
  const {
    rates,
    currencies,
    loading,
    error,
    lastUpdated,
    convert,
    format,
    getSymbol,
    isReady,
    clearError
  } = useCurrency();

  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [conversionResult, setConversionResult] = useState(null);
  const [converting, setConverting] = useState(false);

  // Auto-convert when currencies or amount change
  useEffect(() => {
    if (isReady && amount > 0) {
      performConversion();
    }
  }, [amount, fromCurrency, toCurrency, isReady]);

  const performConversion = async () => {
    if (!isReady || amount <= 0) return;

    try {
      setConverting(true);
      const result = await convert(amount, fromCurrency, toCurrency);
      setConversionResult(result);
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setConverting(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  if (loading && !isReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size="lg" />
        <span className="ml-3 text-gray-600">Loading currency data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Currency Data</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={clearError}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Currency Converter</h2>
        <p className="text-gray-600">
          Real-time exchange rates powered by Exchange Rate API
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 text-sm">
                {getSymbol(fromCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex items-end">
            <button
              onClick={handleSwapCurrencies}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversion Result */}
        {conversionResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {format(conversionResult.amount, conversionResult.fromCurrency)} = {format(conversionResult.convertedAmount, conversionResult.toCurrency)}
              </div>
              <div className="text-sm text-blue-700">
                Exchange Rate: 1 {conversionResult.fromCurrency} = {conversionResult.rate.toFixed(6)} {conversionResult.toCurrency}
              </div>
              {conversionResult.timestamp && (
                <div className="text-xs text-blue-600 mt-2">
                  Rate as of: {new Date(conversionResult.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {converting && (
          <div className="text-center py-4">
            <Loader size="sm" />
            <span className="ml-2 text-gray-600">Converting...</span>
          </div>
        )}

        {/* Quick Conversion Examples */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Conversions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { from: 'USD', to: 'EUR', amount: 100 },
              { from: 'EUR', to: 'GBP', amount: 100 },
              { from: 'USD', to: 'JPY', amount: 100 },
              { from: 'GBP', to: 'USD', amount: 100 }
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setAmount(example.amount);
                  setFromCurrency(example.from);
                  setToCurrency(example.to);
                }}
                className="p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-left"
              >
                <div className="font-medium">{example.amount} {example.from}</div>
                <div className="text-gray-600">→ {example.to}</div>
              </button>
            ))}
          </div>
        </div>

        {/* API Information */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by Exchange Rate API</p>
            <p className="mt-1">
              {currencies.length > 0 && `${currencies.length} currencies supported`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
