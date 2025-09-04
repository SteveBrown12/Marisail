import React, { useState } from 'react';
import PaymentButton from '../components/PaymentButton';
import PaymentModal from '../components/PaymentModal';
import PaymentHistory from '../components/PaymentHistory';

const PaymentDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedType, setSelectedType] = useState('');

  const handleModalPayment = (amount, type) => {
    setSelectedAmount(amount);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // You can add additional logic here like updating UI, redirecting, etc.
  };

  const demoPayments = [
    { amount: 29.99, type: 'Basic Plan', description: 'Monthly subscription' },
    { amount: 99.99, type: 'Premium Plan', description: 'Annual subscription' },
    { amount: 199.99, type: 'Enterprise Plan', description: 'Custom solution' },
    { amount: 49.99, type: 'One-time Service', description: 'Consultation fee' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Integration Demo</h1>
          <p className="text-xl text-gray-600">
            Explore different payment scenarios and components
          </p>
        </div>

        {/* Payment Buttons Demo */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoPayments.map((payment, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{payment.type}</h3>
                <p className="text-sm text-gray-600 mb-4">{payment.description}</p>
                <div className="space-y-2">
                  <PaymentButton
                    amount={payment.amount}
                    type={payment.type.toLowerCase().replace(' ', '-')}
                    className="w-full"
                  >
                    Pay ${payment.amount}
                  </PaymentButton>
                  <button
                    onClick={() => handleModalPayment(payment.amount, payment.type)}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Pay in Modal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal Demo */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Modal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleModalPayment(19.99, 'Demo Service')}
              className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Open Payment Modal ($19.99)
            </button>
            <button
              onClick={() => handleModalPayment(49.99, 'Premium Demo')}
              className="bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Open Payment Modal ($49.99)
            </button>
            <button
              onClick={() => handleModalPayment(99.99, 'Enterprise Demo')}
              className="bg-purple-600 text-white py-3 px-6 rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Open Payment Modal ($99.99)
            </button>
          </div>
        </div>

        {/* Payment History Demo */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment History</h2>
          <PaymentHistory userId="demo-user" />
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          amount={selectedAmount}
          paymentType={selectedType}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default PaymentDemo;
