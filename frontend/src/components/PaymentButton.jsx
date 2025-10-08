import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ApplePayButton from './ApplePayButton';
import GooglePayButton from './GooglePayButton';
import AlipayButton from './AlipayButton';
import WeChatPayButton from './WeChatPayButton';
import KlarnaButton from './KlarnaButton';
import RazorpayButton from './RazorpayButton';
import FlutterwaveButton from './FlutterwaveButton';

const PaymentButton = ({ 
  amount, 
  type = 'service', 
  className = '', 
  children, 
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'outline'
  showApplePay = true, // Show Apple Pay button if available
  showGooglePay = true, // Show Google Pay button if available
  showAlipay = true, // Show Alipay button if available
  showWeChatPay = true, // Show WeChat Pay button if available
  showKlarna = true, // Show Klarna button if available
  showRazorpay = true, // Show Razorpay button if available
  showFlutterwave = true // Show Flutterwave button if available
}) => {
  const navigate = useNavigate();

  const handlePaymentClick = () => {
    if (!amount || amount <= 0) {
      console.error('Invalid payment amount:', amount);
      return;
    }

    // Check if Stripe is configured
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      toast.error('Payment service is not configured. Please contact support.');
      return;
    }

    // Navigate to payment page with amount and type as query parameters
    navigate(`/payment?amount=${amount}&type=${type}`);
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'secondary':
        return `${baseClasses} border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500`;
      case 'outline':
        return `${baseClasses} border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:ring-blue-500`;
      case 'primary':
      default:
        return `${baseClasses} border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {showApplePay && (
        <ApplePayButton
          amount={amount}
          onSuccess={() => {
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            toast.error(error);
          }}
          disabled={disabled}
          className={className}
        />
      )}
      {showGooglePay && (
        <GooglePayButton
          amount={amount}
          onSuccess={() => {
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            toast.error(error);
          }}
          disabled={disabled}
          className={className}
        />
      )}
      {showAlipay && (
        <AlipayButton
          amount={amount}
          onSuccess={() => {
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            toast.error(error);
          }}
          disabled={disabled}
          className={className}
        />
      )}
      {showWeChatPay && (
        <WeChatPayButton
          amount={amount}
          onSuccess={() => {
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            toast.error(error);
          }}
          disabled={disabled}
          className={className}
        />
      )}
      {showKlarna && (
        <KlarnaButton
          amount={amount}
          onSuccess={() => {
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            toast.error(error);
          }}
          disabled={disabled}
          className={className}
        />
      )}
      {showRazorpay && (
        <RazorpayButton
          amount={amount}
          onSuccess={() => {
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            toast.error(error);
          }}
          disabled={disabled}
          className={className}
        />
      )}
      {showFlutterwave && (
        <FlutterwaveButton
          amount={amount}
          onSuccess={() => {
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            toast.error(error);
          }}
          disabled={disabled}
          className={className}
        />
      )}
      <button
        onClick={handlePaymentClick}
        disabled={disabled || !amount || amount <= 0}
        className={`${getButtonClasses()} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <CreditCardIcon className="w-4 h-4 mr-2" />
        {children || `Pay $${amount?.toFixed(2)}`}
      </button>
    </div>
  );
};

export default PaymentButton;
