import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const WeChatPayButton = ({ 
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

  const handleWeChatPayClick = async () => {
    if (!stripe || loading || disabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create WeChat Pay payment intent
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/create-wechat-pay-intent`, {
        amount,
        currency: 'usd',
        metadata: {
          userId: localStorage.getItem('userId') || 'anonymous',
          paymentType: 'wechat_pay',
          timestamp: new Date().toISOString(),
        }
      });

      // Create WeChat Pay session
      const { error: wechatPayError } = await stripe.confirmWeChatPayPayment(
        data.clientSecret,
        {
          return_url: `${window.location.origin}/payment-success`,
        }
      );

      if (wechatPayError) {
        throw new Error(wechatPayError.message);
      }

      // Note: For WeChat Pay, the payment confirmation happens after redirect
      // The success callback will be handled on the return URL
      toast.info('Redirecting to WeChat Pay...');
      
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
      onClick={handleWeChatPayClick}
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
        background: 'linear-gradient(135deg, #07c160 0%, #00d4aa 100%)',
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
            <path d="M8.5 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          Pay with WeChat Pay
        </div>
      )}
    </button>
  );
};

export default WeChatPayButton;
