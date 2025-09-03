import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../components/Loader';

// Payment gateway configurations
const PAYMENT_GATEWAYS = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Credit & Debit Cards',
    icon: '💳',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'PayPal Account',
    icon: '🔵',
    color: 'from-blue-400 to-blue-500',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    description: 'Apple Wallet',
    icon: '🍎',
    color: 'from-gray-800 to-gray-900',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700'
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    description: 'Google Wallet',
    icon: '🔴',
    color: 'from-red-500 to-red-600',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  },
  {
    id: 'amazon-pay',
    name: 'Amazon Pay',
    description: 'Amazon Account',
    icon: '📦',
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700'
  },
  {
    id: 'klarna',
    name: 'Klarna',
    description: 'Buy Now, Pay Later',
    icon: '🌸',
    color: 'from-pink-500 to-pink-600',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700'
  },
  {
    id: 'affirm',
    name: 'Affirm',
    description: 'Installment Payments',
    icon: '💎',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  {
    id: 'crypto',
    name: 'Crypto',
    description: 'Bitcoin, Ethereum',
    icon: '₿',
    color: 'from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  }
];

const PaymentForm = ({ amount, gateway, onSuccess, onError }) => {
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
        console.log('Creating payment intent for amount:', amount);
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-payment-intent`, {
          amount,
          currency: 'usd',
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
      // Add other gateway implementations here
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
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState(null);
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  // Initialize Stripe only when selected
  useEffect(() => {
    if (gateway === 'stripe' && !stripePromise) {
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
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Payment Summary */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Gateway Selection */}
          {!gateway && (
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Select Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PAYMENT_GATEWAYS.map((gatewayOption) => (
                  <button
                    key={gatewayOption.id}
                    onClick={() => setGateway(gatewayOption.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105
                      ${gatewayOption.borderColor} hover:border-gray-400
                      bg-white hover:shadow-lg
                    `}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{gatewayOption.icon}</div>
                      <div className="font-semibold text-gray-900">{gatewayOption.name}</div>
                      <div className="text-xs text-gray-600">{gatewayOption.description}</div>
                    </div>
                  </button>
                ))}
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
              {gateway === 'stripe' && (
                stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={amount}
                      gateway={gateway}
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
                      Payment Service Not Configured
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Stripe payment service is not currently available. Please contact support or try again later.
                    </p>
                  </div>
                )
              )}

              {gateway === 'paypal' && (
                paypalConfig?.enabled && paypalConfig?.clientId ? (
                  <PayPalScriptProvider options={{ clientId: paypalConfig.clientId, currency: 'USD', intent: 'capture' }}>
                    <PayPalButtons
                      style={{ layout: 'vertical' }}
                      createOrder={async () => {
                        try {
                          const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/paypal/create-order`, { amount, currency: 'USD', description: paymentType || 'Payment' });
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
                    <p className="text-gray-600">PayPal is not available.</p>
                  </div>
                )
              )}

              {/* Placeholder for other gateways */}
              {gateway && !['stripe', 'paypal'].includes(gateway) && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    {PAYMENT_GATEWAYS.find(g => g.id === gateway)?.name} integration is under development.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Notice */}
        {gateway && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Your payment information is secure and encrypted. We never store your card details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
