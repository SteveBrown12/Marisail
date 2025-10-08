import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const GooglePayButton = ({ 
  amount, 
  onSuccess, 
  onError, 
  disabled = false,
  className = '',
  style = {}
}) => {
  const [stripe, setStripe] = useState(null);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
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

        // Check if Google Pay is available
        if (stripeInstance && window.google && window.google.payments) {
          const canMakePayments = await stripeInstance.canMakeGooglePayPayments();
          setGooglePayAvailable(canMakePayments);
        } else if (stripeInstance) {
          // Fallback check for Google Pay availability
          const canMakePayments = await stripeInstance.canMakeGooglePayPayments();
          setGooglePayAvailable(canMakePayments);
        }
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        setError('Failed to initialize payment system');
      }
    };

    initializeStripe();
  }, []);

  const handleGooglePayClick = async () => {
    if (!stripe || !googlePayAvailable || loading || disabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create Google Pay payment intent
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-google-pay-intent`, {
        amount,
        currency: 'usd',
        metadata: {
          userId: localStorage.getItem('userId') || 'anonymous',
          paymentType: 'google_pay',
          timestamp: new Date().toISOString(),
        }
      });

      // Create Google Pay session
      const { error: googlePayError } = await stripe.confirmGooglePayPayment(
        data.clientSecret,
        {
          paymentMethod: {
            googlePay: {
              requiredBillingContactFields: ['emailAddress', 'name'],
              requiredShippingContactFields: [],
            },
          },
        }
      );

      if (googlePayError) {
        throw new Error(googlePayError.message);
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

  // Don't render if Google Pay is not available
  if (!googlePayAvailable) {
    return null;
  }

  return (
    <button
      onClick={handleGooglePayClick}
      disabled={disabled || loading || !googlePayAvailable}
      className={`
        inline-flex items-center justify-center px-4 py-2 
        border border-transparent text-sm font-medium rounded-md 
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled || loading || !googlePayAvailable 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:opacity-90'
        }
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
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
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Pay with Google Pay
        </div>
      )}
    </button>
  );
};

export default GooglePayButton;
