import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const AnalyticsDemo = () => {
  const { trackEvent, trackRegistration, trackLogin, trackPayment, trackSearch, isGALoaded } = useAnalytics();
  const [eventName, setEventName] = useState('');
  const [eventParams, setEventParams] = useState('');

  const handleTrackEvent = () => {
    if (!eventName.trim()) return;
    
    try {
      const params = eventParams.trim() ? JSON.parse(eventParams) : {};
      trackEvent(eventName, params);
      alert(`Event "${eventName}" tracked successfully!`);
    } catch (error) {
      alert('Invalid JSON parameters. Please check your input.');
    }
  };

  const handleTrackRegistration = () => {
    trackRegistration('email', 'demo-user-123');
    alert('Registration event tracked!');
  };

  const handleTrackLogin = () => {
    trackLogin('email', 'demo-user-123');
    alert('Login event tracked!');
  };

  const handleTrackPayment = () => {
    trackPayment({
      paymentMethod: 'stripe',
      amount: 99.99,
      currency: 'USD',
      paymentId: 'demo-payment-123',
      userId: 'demo-user-123',
      success: true
    });
    alert('Payment event tracked!');
  };

  const handleTrackSearch = () => {
    trackSearch('sailboat', 25, 'charter', 'demo-user-123');
    alert('Search event tracked!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Analytics Demo</h2>
        <p className="text-gray-600">
          Test Google Analytics tracking functionality
        </p>
        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
          isGALoaded() 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isGALoaded() ? 'Analytics Active' : 'Analytics Inactive'}
        </div>
      </div>

      <div className="space-y-6">
        {/* Custom Event Tracking */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Event Tracking</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., button_click"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Parameters (JSON)
              </label>
              <textarea
                value={eventParams}
                onChange={(e) => setEventParams(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder='{"category": "engagement", "label": "demo"}'
              />
            </div>
            <button
              onClick={handleTrackEvent}
              disabled={!eventName.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Track Custom Event
            </button>
          </div>
        </div>

        {/* Predefined Events */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Predefined Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleTrackRegistration}
              className="bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Track Registration
            </button>
            <button
              onClick={handleTrackLogin}
              className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Track Login
            </button>
            <button
              onClick={handleTrackPayment}
              className="bg-purple-600 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Track Payment
            </button>
            <button
              onClick={handleTrackSearch}
              className="bg-orange-600 text-white py-2 px-4 rounded-md font-medium hover:bg-orange-700 transition-colors"
            >
              Track Search
            </button>
          </div>
        </div>

        {/* Analytics Status */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Analytics Status</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  isGALoaded() 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isGALoaded() ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Environment:</span>
                <span className="ml-2 text-gray-600">
                  {process.env.NODE_ENV || 'development'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Measurement ID:</span>
                <span className="ml-2 text-gray-600">
                  {process.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Page Views:</span>
                <span className="ml-2 text-gray-600">Auto-tracked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Setup Instructions</h3>
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <p className="mb-2"><strong>To enable Google Analytics:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Get your GA4 Measurement ID from Google Analytics</li>
              <li>Add to your <code>.env</code> file: <code>VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX</code></li>
              <li>Restart your development server</li>
              <li>Check the status above - should show "Analytics Active"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDemo;

