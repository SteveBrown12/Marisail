import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Loader from './Loader';

const PaymentHistory = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchPaymentHistory();
    }
  }, [userId]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/payment/payment-history/${userId}`);
      setPayments(data.payments || []);
    } catch (err) {
      setError('Failed to fetch payment history');
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPaymentHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
        <p className="text-gray-500">Your payment history will appear here once you make your first payment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
      
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(payment.status)}
                <div>
                  <p className="font-medium text-gray-900">
                    ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment ID: {payment.id.slice(-8)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                >
                  {payment.status}
                </span>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {new Date(payment.created).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {payment.metadata && Object.keys(payment.metadata).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {Object.entries(payment.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
