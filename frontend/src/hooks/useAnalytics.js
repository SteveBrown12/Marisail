import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../utils/analytics';

/**
 * React hook for Google Analytics tracking
 * Provides easy access to analytics functions with automatic page view tracking
 */
export const useAnalytics = () => {
  const location = useLocation();

  // Initialize GA on mount
  useEffect(() => {
    analytics.initGA();
  }, []);

  // Track page views automatically
  useEffect(() => {
    if (analytics.isGALoaded()) {
      analytics.trackPageView(
        document.title,
        location.pathname + location.search,
        {
          page_referrer: document.referrer,
          user_agent: navigator.userAgent
        }
      );
    }
  }, [location]);

  // Track user registration
  const trackRegistration = useCallback((method = 'email', userId = null) => {
    analytics.trackRegistration(method, userId);
  }, []);

  // Track user login
  const trackLogin = useCallback((method = 'email', userId = null) => {
    analytics.trackLogin(method, userId);
  }, []);

  // Track payment events
  const trackPayment = useCallback((paymentData) => {
    analytics.trackPayment(paymentData);
  }, []);

  // Track search queries
  const trackSearch = useCallback((query, resultsCount, serviceType, userId) => {
    analytics.trackSearch(query, resultsCount, serviceType, userId);
  }, []);

  // Track custom events
  const trackEvent = useCallback((eventName, parameters = {}) => {
    analytics.trackEvent(eventName, parameters);
  }, []);

  // Set user ID
  const setUserId = useCallback((userId) => {
    analytics.setUserId(userId);
  }, []);

  // Check if GA is loaded
  const isGALoaded = useCallback(() => {
    return analytics.isGALoaded();
  }, []);

  return {
    trackRegistration,
    trackLogin,
    trackPayment,
    trackSearch,
    trackEvent,
    setUserId,
    isGALoaded
  };
};

export default useAnalytics;

