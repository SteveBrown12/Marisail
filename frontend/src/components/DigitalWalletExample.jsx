import React, { useState } from 'react';
import ApplePayButton from './ApplePayButton';
import GooglePayButton from './GooglePayButton';
import AlipayButton from './AlipayButton';
import WeChatPayButton from './WeChatPayButton';
import KlarnaButton from './KlarnaButton';
import RazorpayButton from './RazorpayButton';
import FlutterwaveButton from './FlutterwaveButton';
import PaymentModal from './PaymentModal';
import PaymentButton from './PaymentButton';
import { toast } from 'react-toastify';

const DigitalWalletExample = () => {
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
        Digital Wallet & Payment Integration Demo
      </h2>
      
      <div className="space-y-4">
        {/* Individual Digital Wallet Buttons */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Digital Wallet Buttons</h3>
          <p className="text-sm text-gray-600 mb-4">
            Apple Pay and Google Pay buttons will only appear if available on the device. Alipay, WeChat Pay, Klarna, Razorpay, and Flutterwave are always available.
          </p>
          <div className="space-y-2">
            <ApplePayButton
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
            <GooglePayButton
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
            <AlipayButton
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
            <WeChatPayButton
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
            <KlarnaButton
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
            <RazorpayButton
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
            <FlutterwaveButton
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
          </div>
        </div>

        {/* Enhanced Payment Button */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Enhanced Payment Button</h3>
          <p className="text-sm text-gray-600 mb-4">
            Shows Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna, Razorpay, and Flutterwave buttons (if available) above the regular payment button.
          </p>
          <PaymentButton
            amount={amount}
            type="service"
            showApplePay={true}
            showGooglePay={true}
            showAlipay={true}
            showWeChatPay={true}
            showKlarna={true}
            showRazorpay={true}
            showFlutterwave={true}
            variant="primary"
          >
            Pay ${amount}
          </PaymentButton>
        </div>

        {/* Payment Modal */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Payment Modal</h3>
          <p className="text-sm text-gray-600 mb-4">
            Opens a modal with multiple payment options including Apple Pay, Google Pay, Alipay, WeChat Pay, Klarna, Razorpay, and Flutterwave.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Open Payment Modal
          </button>
        </div>

        {/* Payment Method Comparison */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Payment Method Comparison</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Apple Pay:</span>
              <span className="text-green-600">Touch ID / Face ID</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Google Pay:</span>
              <span className="text-blue-600">Google Account</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Alipay:</span>
              <span className="text-blue-500">Alipay Account</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">WeChat Pay:</span>
              <span className="text-green-500">WeChat Account</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Klarna:</span>
              <span className="text-pink-500">Flexible Payment</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Razorpay:</span>
              <span className="text-blue-500">Multiple Methods</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Flutterwave:</span>
              <span className="text-orange-500">African Payments</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Credit Card:</span>
              <span className="text-gray-600">Manual Entry</span>
            </div>
          </div>
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
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Digital Wallet Requirements:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Apple Pay:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• Safari on macOS (10.12.4+)</li>
              <li>• Safari on iOS (10.1+)</li>
              <li>• Touch ID or Face ID enabled</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Google Pay:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• Chrome on Android (4.4+)</li>
              <li>• Chrome on desktop</li>
              <li>• Google account signed in</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Alipay:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• All modern browsers</li>
              <li>• Mobile and desktop</li>
              <li>• Alipay account required</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-1">WeChat Pay:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• All modern browsers</li>
              <li>• Mobile and desktop</li>
              <li>• WeChat account required</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Klarna:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• All modern browsers</li>
              <li>• Mobile and desktop</li>
              <li>• Flexible payment options</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Razorpay:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• All modern browsers</li>
              <li>• Mobile and desktop</li>
              <li>• Multiple payment methods</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-1">Flutterwave:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• All modern browsers</li>
              <li>• Mobile and desktop</li>
              <li>• African payment methods</li>
            </ul>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Both require HTTPS in production and domain verification.
        </div>
      </div>

      {/* Security Information */}
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">Security Features:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Payment information is tokenized</li>
          <li>• No card details stored locally</li>
          <li>• Secure authentication required</li>
          <li>• PCI DSS compliant through Stripe</li>
        </ul>
      </div>
    </div>
  );
};

export default DigitalWalletExample;
