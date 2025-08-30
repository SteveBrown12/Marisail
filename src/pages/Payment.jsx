import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../components/Loader';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = (() => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.warn('⚠️  VITE_STRIPE_PUBLISHABLE_KEY not found. Stripe will not initialize.');
    return Promise.resolve(null);
  }
  return loadStripe(publishableKey);
})();

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment service is not configured. Please contact support.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-payment-intent`, {
        amount,
        currency: 'usd',
        metadata: {
          userId: localStorage.getItem('userId') || 'anonymous',
          timestamp: new Date().toISOString(),
        }
      });

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onError?.(stripeError.message);
        toast.error(`Payment failed: ${stripeError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await axios.post('/api/payment/confirm-payment', {
          paymentIntentId: paymentIntent.id
        });
        
        onSuccess?.(paymentIntent);
        toast.success('Payment successful!');
      }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
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
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">
            {paymentType ? `Payment for ${paymentType}` : 'Secure payment powered by Stripe'}
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

          {/* Payment Form */}
          <div className="p-6">
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={amount}
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
                <p className="text-gray-600 mb-4">
                  Stripe payment service is not currently available. Please contact support or try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your payment information is secure and encrypted. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
