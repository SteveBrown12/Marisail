import React, { useState } from 'react';
import PaymentButton from './PaymentButton';
import PaymentModal from './PaymentModal';

const ServicePaymentExample = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalPayment = () => {
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Service payment successful:', paymentIntent);
    // Update service status, send confirmation email, etc.
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {service.name} - Payment Options
      </h3>
      
      <div className="space-y-4">
        {/* Service Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900">Service Type:</span>
            <span className="text-gray-600 capitalize">{service.type}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900">Duration:</span>
            <span className="text-gray-600">{service.duration}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Price:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${service.price}
            </span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Choose Payment Method:</h4>
          
          {/* Option 1: Direct Payment Button */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Option 1: Direct Payment</h5>
            <p className="text-sm text-gray-600 mb-3">
              Click the button below to go to the payment page.
            </p>
            <PaymentButton
              amount={service.price}
              type={service.type}
              className="w-full"
            >
              Pay ${service.price} - {service.name}
            </PaymentButton>
          </div>

          {/* Option 2: Modal Payment */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Option 2: Inline Payment</h5>
            <p className="text-sm text-gray-600 mb-3">
              Complete payment without leaving this page.
            </p>
            <button
              onClick={handleModalPayment}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Pay ${service.price} - Inline
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">What happens after payment?</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll receive a confirmation email</li>
            <li>• Service will be activated immediately</li>
            <li>• Access to premium features unlocked</li>
            <li>• 24/7 customer support available</li>
          </ul>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={service.price}
        paymentType={service.name}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ServicePaymentExample;
