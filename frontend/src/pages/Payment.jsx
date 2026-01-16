import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Loader } from '../components/Common_Utils';
import { useAnalytics } from '../hooks/useAnalytics';
import ApplePayButton from '../components/ApplePayButton';
import GooglePayButton from '../components/GooglePayButton';
import AlipayButton from '../components/AlipayButton';
import WeChatPayButton from '../components/WeChatPayButton';
import KlarnaButton from '../components/KlarnaButton';
import RazorpayButton from '../components/RazorpayButton';
import FlutterwaveButton from '../components/FlutterwaveButton';
import { initIPInfo } from '../utils/ipInfo';

// Payment gateway configurations
const PAYMENT_GATEWAYS = [
  {
    id: 'stripe',
    name: 'Credit Card',
    description: 'Visa, Mastercard, Amex',
    icon: '💳',
    color: 'from-indigo-500 to-indigo-600',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    available: true,
    provider: 'stripe'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'PayPal Account',
    icon: '💰',
    color: 'from-blue-400 to-blue-500',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    available: true,
    provider: 'paypal'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'Touch ID / Face ID',
    icon: '🍎',
    color: 'from-gray-800 to-gray-900',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    available: true,
    provider: 'stripe'
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    description: 'Google Wallet',
    icon: '🔵',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    available: true,
    provider: 'stripe'
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'UPI, Cards, Netbanking',
    icon: '🇮🇳',
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    available: true,
    provider: 'razorpay'
  },
  {
    id: 'alipay',
    name: 'Alipay',
    description: 'Chinese Market',
    icon: '🇨🇳',
    color: 'from-blue-400 to-blue-500',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    available: true,
    provider: 'stripe'
  },
  {
    id: 'wechat_pay',
    name: 'WeChat Pay',
    description: 'WeChat Account',
    icon: '💬',
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    available: true,
    provider: 'stripe'
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    description: 'African Payments',
    icon: '🌍',
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    available: true,
    provider: 'flutterwave'
  },
  {
    id: 'klarna',
    name: 'Klarna',
    description: 'Buy Now, Pay Later',
    icon: '🛍️',
    color: 'from-pink-500 to-pink-600',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    available: true,
    provider: 'stripe'
  }
];

const PaymentForm = ({ amount, gateway, onSuccess, onError, currency = 'USD' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (gateway === 'stripe') {
      if (!stripe || !elements) {
        setError('Payment service is not configured. Please contact support.');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      if (gateway === 'stripe') {
        // Create payment intent
        console.log('Creating payment intent for amount:', amount, 'currency:', currency);
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-payment-intent`, {
          amount,
          currency: currency.toLowerCase(),
          metadata: {
            userId: localStorage.getItem('userId') || 'anonymous',
            timestamp: new Date().toISOString(),
          }
        });
        
        console.log('Payment intent created:', data);

        // Confirm payment with Stripe
        console.log('Confirming payment with Stripe using client secret:', data.clientSecret);
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
            },
          }
        );
        
        console.log('Stripe confirmation result:', { error: stripeError, paymentIntent });

        if (stripeError) {
          setError(stripeError.message);
          onError?.(stripeError.message);
          toast.error(`Payment failed: ${stripeError.message}`);
        } else if (paymentIntent.status === 'succeeded') {
          // Confirm payment on backend
          console.log('Confirming payment on backend with ID:', paymentIntent.id);
          const confirmResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/confirm-payment`, {
            paymentIntentId: paymentIntent.id
          });
          
          console.log('Backend confirmation response:', confirmResponse.data);
          onSuccess?.(paymentIntent);
          toast.success('Payment successful!');
        }
      }
      // Other gateways are handled by their respective button components
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Payment failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  // Render payment buttons for Razorpay and Flutterwave (separate gateways)
  if (['razorpay', 'flutterwave'].includes(gateway)) {
    const PaymentButtonComponent = {
      razorpay: RazorpayButton,
      flutterwave: FlutterwaveButton
    }[gateway];

    if (PaymentButtonComponent) {
      return (
        <div className="space-y-6">
          <div className="text-center py-6">
            <div className="text-gray-600 mb-4">
              <div className="text-4xl mb-2">
                {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.name}
              </h3>
              <p className="text-gray-600">
                {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.description}
              </p>
            </div>

            <PaymentButtonComponent
              amount={amount}
              currency={userCurrency}
              onSuccess={() => {
                onSuccess?.({ id: `payment_${Date.now()}` });
                toast.success('Payment successful!');
              }}
              onError={(error) => {
                setError(error);
                onError?.(error);
                toast.error(error);
              }}
              disabled={loading}
              className="w-full"
            />

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Render payment buttons for digital wallets via Stripe
  if (['apple_pay', 'google_pay', 'alipay', 'wechat_pay', 'klarna'].includes(gateway)) {
    const PaymentButtonComponent = {
      apple_pay: ApplePayButton,
      google_pay: GooglePayButton,
      alipay: AlipayButton,
      wechat_pay: WeChatPayButton,
      klarna: KlarnaButton,
    }[gateway];

    if (PaymentButtonComponent) {
      return (
        <div className="space-y-6">
          <div className="text-center py-6">
            <div className="text-gray-600 mb-4">
              <div className="text-4xl mb-2">
                {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.name}
              </h3>
              <p className="text-gray-600">
                {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.description}
              </p>
            </div>
            
            <PaymentButtonComponent
              amount={amount}
              onSuccess={() => {
                onSuccess?.({ id: `payment_${Date.now()}` });
                toast.success('Payment successful!');
              }}
              onError={(error) => {
                setError(error);
                onError?.(error);
                toast.error(error);
              }}
              disabled={loading}
              className="w-full"
            />
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Render credit card form for Stripe
  if (gateway === 'stripe') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Payment Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="border border-gray-300 rounded-md p-3">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader size="sm" />
              <span className="ml-2">Processing Payment...</span>
            </div>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </form>
    );
  }

  return null;
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackPayment, trackEvent } = useAnalytics();
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState(null);
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [userCurrency, setUserCurrency] = useState('USD');
  const [userCountry, setUserCountry] = useState('US');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  // Helper function to determine recommended payment gateway based on location
  const getRecommendedGateway = () => {
    // African countries - recommend Flutterwave
    const africanCountries = ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'RW', 'SL', 'GM'];
    if (africanCountries.includes(userCountry)) {
      return 'flutterwave';
    }

    // India - recommend Razorpay
    if (userCountry === 'IN' || userCurrency === 'INR') {
      return 'razorpay';
    }

    // China - recommend Alipay/WeChat Pay
    if (userCountry === 'CN' || userCurrency === 'CNY') {
      return 'alipay';
    }

    // Default to Stripe for other countries
    return 'stripe';
  };

  // Detect user's location and currency
  useEffect(() => {
    const detectLocationAndCurrency = async () => {
      try {
        // Try to get from localStorage first
        const cachedIpInfo = localStorage.getItem('ipInfo');
        let ipInfo;

        if (cachedIpInfo) {
          ipInfo = JSON.parse(cachedIpInfo);
        } else {
          // Fetch new ipInfo
          ipInfo = await initIPInfo();
        }

        if (ipInfo) {
          setUserCurrency(ipInfo.currency || 'USD');
          setUserCountry(ipInfo.countryCode || 'US');
          setCurrencySymbol(ipInfo.currencySymbol || '$');

          console.log('💰 Detected user location:', {
            country: ipInfo.country,
            countryCode: ipInfo.countryCode,
            currency: ipInfo.currency,
            symbol: ipInfo.currencySymbol
          });

          // Show toast notification about detected currency
          toast.info(`Payment currency set to ${ipInfo.currency} based on your location (${ipInfo.country})`, {
            autoClose: 3000
          });
        }
      } catch (error) {
        console.error('Failed to detect location/currency:', error);
        // Fallback to USD
        setUserCurrency('USD');
        setUserCountry('US');
        setCurrencySymbol('$');
      }
    };

    detectLocationAndCurrency();
  }, []);

  // Initialize Stripe for all payment methods (they all use Stripe)
  useEffect(() => {
    if (gateway && !stripePromise) {
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (publishableKey) {
        setStripePromise(loadStripe(publishableKey));
      }
    }
  }, [gateway, stripePromise]);

  useEffect(() => {
    // Get payment details from location state or query params
    const params = new URLSearchParams(location.search);
    const amountParam = params.get('amount');
    const typeParam = params.get('type');
    
    if (amountParam) {
      setAmount(parseFloat(amountParam));
    }
    if (typeParam) {
      setPaymentType(typeParam);
    }
  }, [location]);

  // Load payment configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payment/config`);
        setPaypalConfig(data?.paypal || null);
        console.log('Payment config loaded:', data);
      } catch (e) {
        console.error('Failed to load payment config:', e);
        setPaypalConfig(null);
      }
    };
    loadConfig();
  }, []);

  const handlePaymentSuccess = (paymentIntent) => {
    // Track successful payment
    trackPayment({
      paymentMethod: gateway,
      amount: amount,
      currency: userCurrency,
      paymentId: paymentIntent.id,
      userId: localStorage.getItem('userId') || 'anonymous',
      success: true
    });

    // Track payment gateway selection
    trackEvent('payment_gateway_selected', {
      gateway: gateway,
      amount: amount,
      user_id: localStorage.getItem('userId') || 'anonymous'
    });

    // Redirect to success page or dashboard
    navigate('/payment-success', { 
      state: { 
        paymentId: paymentIntent.id,
        amount: amount,
        type: paymentType 
      } 
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    
    // Track payment error
    trackEvent('payment_error', {
      error_message: error,
      gateway: gateway,
      amount: amount,
      user_id: localStorage.getItem('userId') || 'anonymous'
    });
    
    // Handle payment error (already shown in toast)
  };

  if (!amount || amount <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Invalid Payment Amount</h2>
          <p className="text-gray-600 mb-6">
            No valid payment amount was provided. Please return to the previous page.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">
            {paymentType ? `Payment for ${paymentType}` : 'Choose your preferred payment method'}
          </p>

          {/* Location/Currency indicator */}
          {userCountry !== 'US' && (
            <div className="mt-3 inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-blue-800">
                Payment currency: <strong>{userCurrency}</strong> ({userCountry})
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Payment Summary */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-blue-600">
                  {currencySymbol}{amount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600">{userCurrency}</span>
              </div>
            </div>
          </div>

          {/* Payment Gateway Selection */}
          {!gateway && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Payment Method</h3>
                <p className="text-gray-600">Select from our secure payment options</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PAYMENT_GATEWAYS.map((gatewayOption) => {
                  const isRecommended = getRecommendedGateway() === gatewayOption.id;

                  return (
                    <button
                      key={gatewayOption.id}
                      onClick={() => setGateway(gatewayOption.id)}
                      className={`
                        group relative p-6 rounded-xl border-2 transition-all duration-300
                        ${isRecommended ? 'border-green-400 ring-2 ring-green-200' : gatewayOption.borderColor}
                        hover:border-gray-400
                        bg-white hover:shadow-xl hover:-translate-y-1
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      `}
                    >
                      {/* Recommended badge */}
                      {isRecommended && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          ✓ Recommended
                        </div>
                      )}

                      <div className="text-center space-y-3">
                        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                          {gatewayOption.icon}
                        </div>
                        <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {gatewayOption.name}
                        </div>
                        <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                          {gatewayOption.description}
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  );
                })}
              </div>
              
              {/* Security notice */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>All payments are secured with 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          )}

          {/* Gateway Header with Back Button */}
          {gateway && (
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGateway(null)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {gateway && (
            <div className="p-6">
              {/* Razorpay and Flutterwave (separate gateways, don't need Stripe) */}
              {['razorpay', 'flutterwave'].includes(gateway) && (
                <PaymentForm
                  amount={amount}
                  gateway={gateway}
                  currency={userCurrency}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {/* Digital Wallet Payments via Stripe */}
              {['apple_pay', 'google_pay', 'alipay', 'wechat_pay', 'klarna'].includes(gateway) && (
                stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={amount}
                      gateway={gateway}
                      currency={userCurrency}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-yellow-600 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Payment Service Loading
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Please wait while we initialize the payment service...
                    </p>
                    <div className="flex justify-center">
                      <Loader size="md" />
                    </div>
                  </div>
                )
              )}

              {/* Credit Card Payment */}
              {gateway === 'stripe' && (
                stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={amount}
                      gateway={gateway}
                      currency={userCurrency}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-yellow-600 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Payment Service Loading
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Please wait while we initialize the payment service...
                    </p>
                    <div className="flex justify-center">
                      <Loader size="md" />
                    </div>
                  </div>
                )
              )}

              {/* PayPal Payment */}
              {gateway === 'paypal' && (
                paypalConfig?.enabled && paypalConfig?.clientId ? (
                  <PayPalScriptProvider options={{ clientId: paypalConfig.clientId, currency: userCurrency, intent: 'capture' }}>
                    <PayPalButtons
                      style={{ layout: 'vertical' }}
                      createOrder={async () => {
                        try {
                          const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/paypal/create-order`, { amount, currency: userCurrency, description: paymentType || 'Payment' });
                          return data.id;
                        } catch (e) {
                          toast.error('Failed to create PayPal order');
                          throw e;
                        }
                      }}
                      onApprove={async (data) => {
                        try {
                          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/paypal/capture-order`, { orderId: data.orderID });
                          if (res.data?.status === 'COMPLETED') {
                            toast.success('Payment successful!');
                            handlePaymentSuccess({ id: res.data?.id || data.orderID });
                          } else {
                            toast.error('Payment not completed');
                          }
                        } catch (e) {
                          toast.error('Failed to capture PayPal order');
                        }
                      }}
                      onError={(err) => {
                        console.error(err);
                        toast.error('PayPal error');
                      }}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-yellow-600 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      PayPal Not Available
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      PayPal payment service is not currently configured. Please try another payment method.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Security Notice */}
        {gateway && (
          <div className="mt-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Secure Payment Processing</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your payment information is encrypted with 256-bit SSL and processed securely through Stripe. We never store your card details.
              </p>
            </div>
          </div>
        )}

        {/* Payment Methods Summary */}
        {!gateway && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3 text-center">9 Payment Methods Available</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {PAYMENT_GATEWAYS.map((gateway) => (
                <div key={gateway.id} className="flex items-center space-x-2">
                  <span className="text-lg">{gateway.icon}</span>
                  <span className="text-blue-800">
                    <strong>{gateway.name}:</strong> {gateway.description}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-700">
                Powered by <strong>Stripe</strong>, <strong>PayPal</strong>, <strong>Razorpay</strong>, and <strong>Flutterwave</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
