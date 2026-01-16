import React, { useState, useEffect } from 'react';
import { useFlutterwave, closePaymentModal } from 'react-flutterwave';
import { toast } from 'react-toastify';
import axios from 'axios';

const FlutterwaveButton = ({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  disabled = false,
  className = '',
  style = {}
}) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [flwConfig, setFlwConfig] = useState(null);

  useEffect(() => {
    // Load payment configuration
    const loadConfig = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payment/config`);
        setConfig(data);

        if (data.flutterwave?.enabled && data.flutterwave?.publicKey) {
          setFlwConfig({
            public_key: data.flutterwave.publicKey,
            tx_ref: `flw_tx_${Date.now()}`,
            amount: amount,
            currency: currency.toUpperCase(),
            payment_options: 'card,mobilemoney,ussd',
            customer: {
              email: localStorage.getItem('userEmail') || 'customer@example.com',
              phone_number: localStorage.getItem('userPhone') || '',
              name: localStorage.getItem('userName') || 'Customer',
            },
            customizations: {
              title: 'Marisail Payment',
              description: 'Payment for services',
              logo: '',
            },
          });
        }
      } catch (err) {
        console.error('Failed to load payment config:', err);
      }
    };

    loadConfig();
  }, [amount, currency]);

  const handleFlutterwave = useFlutterwave(flwConfig || {});

  const handlePayment = () => {
    if (!config?.flutterwave?.enabled) {
      toast.error('Flutterwave is not configured. Please contact support.');
      return;
    }

    if (!flwConfig) {
      toast.error('Payment configuration is not ready. Please try again.');
      return;
    }

    setLoading(true);

    handleFlutterwave({
      callback: async (response) => {
        console.log('Flutterwave payment response:', response);
        closePaymentModal();

        if (response.status === 'successful') {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/payment/flutterwave/verify-payment`,
              {
                transaction_id: response.transaction_id,
              }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              onSuccess?.({
                id: response.transaction_id,
                flw_ref: response.flw_ref,
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            const errorMessage = err.response?.data?.error || 'Payment verification failed';
            toast.error(errorMessage);
            onError?.(errorMessage);
          }
        } else {
          const errorMessage = response.status === 'cancelled'
            ? 'Payment was cancelled'
            : 'Payment failed';
          toast.error(errorMessage);
          onError?.(errorMessage);
        }
        setLoading(false);
      },
      onClose: () => {
        setLoading(false);
        toast.info('Payment window closed');
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading || !config?.flutterwave?.enabled || !flwConfig}
      className={`
        inline-flex items-center justify-center px-6 py-3
        border border-transparent text-base font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
        shadow-md hover:shadow-lg
        ${disabled || loading || !config?.flutterwave?.enabled || !flwConfig
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:opacity-90 transform hover:-translate-y-0.5'
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
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : !config ? (
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
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8V8.5l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z"/>
          </svg>
          Pay with Flutterwave - {currency} {amount}
        </div>
      )}
    </button>
  );
};

export default FlutterwaveButton;
