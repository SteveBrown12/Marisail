import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const RazorpayButton = ({
  amount,
  currency = 'INR',
  onSuccess,
  onError,
  disabled = false,
  className = '',
  style = {}
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setError('Failed to load payment system');
    };
    document.body.appendChild(script);

    // Load payment configuration
    const loadConfig = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payment/config`);
        setConfig(data);
      } catch (err) {
        console.error('Failed to load payment config:', err);
      }
    };

    loadConfig();

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded || loading || disabled) {
      toast.error('Payment system is still loading. Please wait...');
      return;
    }

    if (!config?.razorpay?.enabled) {
      toast.error('Razorpay is not configured. Please contact support.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create Razorpay order on backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/razorpay/create-order`,
        {
          amount,
          currency: currency.toUpperCase(),
          metadata: {
            userId: localStorage.getItem('userId') || 'anonymous',
            paymentType: 'razorpay',
            timestamp: new Date().toISOString(),
          }
        }
      );

      const options = {
        key: config.razorpay.keyId,
        amount: data.amount * 100, // Amount in smallest currency unit
        currency: data.currency,
        name: 'Marisail',
        description: 'Payment for services',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/payment/razorpay/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              onSuccess?.({
                id: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            const errorMessage = err.response?.data?.error || 'Payment verification failed';
            toast.error(errorMessage);
            onError?.(errorMessage);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || '',
        },
        theme: {
          color: '#3395ff',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

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
      onClick={handleRazorpayPayment}
      disabled={disabled || loading || !razorpayLoaded || !config?.razorpay?.enabled}
      className={`
        inline-flex items-center justify-center px-6 py-3
        border border-transparent text-base font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        shadow-md hover:shadow-lg
        ${disabled || loading || !razorpayLoaded || !config?.razorpay?.enabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:opacity-90 transform hover:-translate-y-0.5'
        }
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #3395ff 0%, #0066cc 100%)',
        color: 'white',
        ...style
      }}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : !razorpayLoaded ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        <div className="flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.436 0l-11.436 7.713-4.273-3.242-4.727 3.542 9 10.987 16-19z"/>
          </svg>
          Pay with Razorpay - {currency} {amount}
        </div>
      )}
    </button>
  );
};

export default RazorpayButton;
