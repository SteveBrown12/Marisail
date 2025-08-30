import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const PaymentButton = ({ 
  amount, 
  type = 'service', 
  className = '', 
  children, 
  disabled = false,
  variant = 'primary' // 'primary', 'secondary', 'outline'
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
    <button
      onClick={handlePaymentClick}
      disabled={disabled || !amount || amount <= 0}
      className={`${getButtonClasses()} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <CreditCardIcon className="w-4 h-4 mr-2" />
      {children || `Pay $${amount?.toFixed(2)}`}
    </button>
  );
};

export default PaymentButton;
