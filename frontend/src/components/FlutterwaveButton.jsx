import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const FlutterwaveButton = ({ 
  amount, 
  onSuccess, 
  onError, 
  disabled = false,
  className = '',
  style = {}
}) => {
  const [stripe, setStripe] = useState(null);
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
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        setError('Failed to initialize payment system');
      }
    };

    initializeStripe();
  }, []);

  const handleFlutterwaveClick = async () => {
    if (!stripe || loading || disabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create Flutterwave payment intent
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-flutterwave-intent`, {
        amount,
        currency: 'usd',
        metadata: {
          userId: localStorage.getItem('userId') || 'anonymous',
          paymentType: 'flutterwave',
          timestamp: new Date().toISOString(),
        }
      });

      // Create Flutterwave session
      const { error: flutterwaveError } = await stripe.confirmFlutterwavePayment(
        data.clientSecret,
        {
          return_url: `${window.location.origin}/payment-success`,
        }
      );

      if (flutterwaveError) {
        throw new Error(flutterwaveError.message);
      }

      // Note: For Flutterwave, the payment confirmation happens after redirect
      // The success callback will be handled on the return URL
      toast.info('Redirecting to Flutterwave...');
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFlutterwaveClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center px-4 py-2 
        border border-transparent text-sm font-medium rounded-md 
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled || loading 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:opacity-90'
        }
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #f5a623 0%, #f7931e 100%)',
        color: 'white',
        ...style
      }}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Redirecting...
        </div>
      ) : (
        <div className="flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
          Pay with Flutterwave
        </div>
      )}
    </button>
  );
};

export default FlutterwaveButton;
