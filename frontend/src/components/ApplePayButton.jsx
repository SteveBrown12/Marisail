import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const ApplePayButton = ({ 
  amount, 
  onSuccess, 
  onError, 
  disabled = false,
  className = '',
  style = {}
}) => {
  const [stripe, setStripe] = useState(null);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          console.error('Stripe publishable key not found');
          return;
        }

        const stripeInstance = await loadStripe(publishableKey);
        setStripe(stripeInstance);

        // Check if Apple Pay is available
        if (stripeInstance && window.ApplePaySession) {
          const canMakePayments = await stripeInstance.canMakeApplePayPayments();
          setApplePayAvailable(canMakePayments);
        }
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        setError('Failed to initialize payment system');
      }
    };

    initializeStripe();
  }, []);

  const handleApplePayClick = async () => {
    if (!stripe || !applePayAvailable || loading || disabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create Apple Pay payment intent
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-apple-pay-intent`, {
        amount,
        currency: 'usd',
        metadata: {
          userId: localStorage.getItem('userId') || 'anonymous',
          paymentType: 'apple_pay',
          timestamp: new Date().toISOISOString(),
        }
      });

      // Create Apple Pay session
      const { error: applePayError } = await stripe.confirmApplePayPayment(
        data.clientSecret,
        {
          paymentMethod: {
            applePay: {
              requiredBillingContactFields: ['emailAddress', 'name'],
              requiredShippingContactFields: [],
            },
          },
        }
      );

      if (applePayError) {
        throw new Error(applePayError.message);
      }

      // Confirm payment on backend
      await axios.post('/api/payment/confirm-payment', {
        paymentIntentId: data.paymentIntentId
      });

      onSuccess?.();
      toast.success('Payment successful!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if Apple Pay is not available
  if (!applePayAvailable) {
    return null;
  }

  return (
    <button
      onClick={handleApplePayClick}
      disabled={disabled || loading || !applePayAvailable}
      className={`
        inline-flex items-center justify-center px-4 py-2 
        border border-transparent text-sm font-medium rounded-md 
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled || loading || !applePayAvailable 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:opacity-90'
        }
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        color: 'white',
        ...style
      }}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        <div className="flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Pay with Apple Pay
        </div>
      )}
    </button>
  );
};

export default ApplePayButton;
