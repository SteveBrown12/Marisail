import React, { useState } from 'react';
import ApplePayButton from './ApplePayButton';
import PaymentModal from './PaymentModal';
import PaymentButton from './PaymentButton';
import { toast } from 'react-toastify';

const ApplePayExample = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [amount] = useState(29.99);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    toast.success('Payment completed successfully!');
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    toast.error(`Payment failed: ${error}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Apple Pay Integration Demo
      </h2>
      
      <div className="space-y-4">
        {/* Direct Apple Pay Button */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Direct Apple Pay Button</h3>
          <p className="text-sm text-gray-600 mb-4">
            This button will only appear if Apple Pay is available on the device.
          </p>
          <ApplePayButton
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            className="w-full"
          />
        </div>

        {/* Enhanced Payment Button */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Enhanced Payment Button</h3>
          <p className="text-sm text-gray-600 mb-4">
            Shows Apple Pay button (if available) above the regular payment button.
          </p>
          <PaymentButton
            amount={amount}
            type="service"
            showApplePay={true}
            variant="primary"
          >
            Pay ${amount}
          </PaymentButton>
        </div>

        {/* Payment Modal */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Payment Modal</h3>
          <p className="text-sm text-gray-600 mb-4">
            Opens a modal with multiple payment options including Apple Pay.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Open Payment Modal
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        amount={amount}
        paymentType="service"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      {/* Information Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Apple Pay Requirements:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Safari on macOS (10.12.4+) or iOS (10.1+)</li>
          <li>• HTTPS enabled (required for production)</li>
          <li>• Domain verified with Apple Pay</li>
          <li>• Touch ID or Face ID enabled</li>
        </ul>
      </div>
    </div>
  );
};

export default ApplePayExample;
