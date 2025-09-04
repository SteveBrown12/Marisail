import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Loader } from './Common_Utils';

// Payment method options
const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    name: 'Credit Card',
    description: 'Pay with Visa, Mastercard, or American Express',
    icon: '💳',
    available: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🔵',
    available: true
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer (2-3 business days)',
    icon: '🏦',
    available: false
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Pay with Bitcoin, Ethereum, or USDC',
    icon: '₿',
    available: false
  }
];

const stripePromise = (() => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.warn('⚠️  VITE_STRIPE_PUBLISHABLE_KEY not found. Stripe will not initialize.');
    return null;
  }
  return loadStripe(publishableKey);
})();

const PaymentForm = ({ amount, onSuccess, onClose, paymentType = 'service', selectedMethod }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Handle different payment methods
      if (selectedMethod === 'paypal') {
        // Redirect to PayPal or handle PayPal payment
        toast.info('PayPal integration coming soon!');
        setLoading(false);
        return;
      }

      // Create payment intent for credit card
      const { data } = await axios.post('/api/payment/create-payment-intent', {
        amount,
        currency: 'usd',
        paymentMethod: selectedMethod,
        metadata: {
          userId: localStorage.getItem('userId') || 'anonymous',
          paymentType,
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
        toast.error(`Payment failed: ${stripeError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await axios.post('/api/payment/confirm-payment', {
          paymentIntentId: paymentIntent.id
        });
        
        onSuccess?.(paymentIntent);
        toast.success('Payment successful!');
        onClose();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Payment failed. Please try again.';
      setError(errorMessage);
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

  // Render different forms based on payment method
  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'credit_card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="border border-gray-300 rounded-md p-3">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
          </div>
        );
      
      case 'paypal':
        return (
          <div className="text-center py-6">
            <div className="text-blue-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H18.5v-1.956h-.278c-.681 0-1.352-.163-1.844-.478-.492-.315-.844-.825-.844-1.478 0-.653.352-1.163.844-1.478.492-.315 1.163-.478 1.844-.478H18.5v-1.956h.278c.681 0 1.352.163 1.844.478z"/>
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              You will be redirected to PayPal to complete your payment securely.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Redirecting to PayPal...' : 'Continue with PayPal'}
            </button>
          </div>
        );
      
      case 'bank_transfer':
        return (
          <div className="text-center py-6">
            <div className="text-yellow-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Bank transfer details will be provided after order confirmation.
            </p>
            <p className="text-sm text-gray-500">
              Processing time: 2-3 business days
            </p>
          </div>
        );
      
      case 'crypto':
        return (
          <div className="text-center py-6">
            <div className="text-yellow-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Cryptocurrency payment integration coming soon!
            </p>
            <p className="text-sm text-gray-500">
              We're working on adding support for Bitcoin, Ethereum, and USDC
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderPaymentForm()}
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {selectedMethod === 'credit_card' && (
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader size="sm" />
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </div>
      )}
    </form>
  );
};

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  paymentType = 'service',
  onSuccess 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('credit_card');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Complete Payment
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {paymentType ? `Payment for ${paymentType}` : 'Secure payment powered by Stripe'}
            </p>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-6">
            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={!method.available}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      !method.available
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                    {!method.available && (
                      <div className="text-xs text-gray-500 mt-2">Coming Soon</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={amount}
                  paymentType={paymentType}
                  selectedMethod={selectedMethod}
                  onSuccess={onSuccess}
                  onClose={onClose}
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
                  Payment Service Not Available
                </h3>
                <p className="text-gray-600 mb-4">
                  Stripe payment service is not currently configured. Please contact support.
                </p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
