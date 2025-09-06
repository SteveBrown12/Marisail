import React, { createContext, useContext, useEffect } from 'react';
import analytics from '../utils/analytics';

// Create Analytics Context
const AnalyticsContext = createContext();

// Analytics Provider Component
export const GoogleAnalyticsProvider = ({ children }) => {
  useEffect(() => {
    // Initialize Google Analytics when the provider mounts
    analytics.initGA();
  }, []);

  const value = {
    analytics,
    trackPageView: analytics.trackPageView,
    trackEvent: analytics.trackEvent,
    trackRegistration: analytics.trackRegistration,
    trackLogin: analytics.trackLogin,
    trackPayment: analytics.trackPayment,
    trackSearch: analytics.trackSearch,
    setUserId: analytics.setUserId,
    isGALoaded: analytics.isGALoaded
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook to use analytics context
export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within a GoogleAnalyticsProvider');
  }
  return context;
};

export default GoogleAnalyticsProvider;

