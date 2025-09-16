// Google Analytics 4 Configuration and Utilities
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const GA_ENABLED = 'true';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_ENABLED || typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: false
  });

  console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
};

// Track page view
export const trackPageView = (pageTitle, pagePath, customParams = {}) => {
  if (!GA_ENABLED || typeof window === 'undefined' || !window.gtag) return;

  const params = {
    page_title: pageTitle,
    page_location: window.location.origin + pagePath,
    page_path: pagePath,
    ...customParams
  };

  window.gtag('event', 'page_view', params);
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (!GA_ENABLED || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, parameters);
};

// Track user registration
export const trackRegistration = (method = 'email', userId = null) => {
  trackEvent('sign_up', { method, user_id: userId });
};

// Track user login
export const trackLogin = (method = 'email', userId = null) => {
  trackEvent('login', { method, user_id: userId });
};

// Track payment events
export const trackPayment = (paymentData) => {
  const { paymentMethod, amount, currency = 'USD', paymentId, userId, success = true } = paymentData;
  
  trackEvent('payment_attempt', {
    payment_method: paymentMethod,
    value: amount,
    currency,
    payment_id: paymentId,
    user_id: userId,
    success
  });

  if (success) {
    trackEvent('purchase', {
      transaction_id: paymentId,
      value: amount,
      currency,
      payment_method: paymentMethod,
      user_id: userId
    });
  }
};

// Track search queries
export const trackSearch = (query, resultsCount, serviceType, userId) => {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
    service_type: serviceType,
    user_id: userId
  });
};

// Set user ID
export const setUserId = (userId) => {
  if (!GA_ENABLED || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, { user_id: userId });
};

// Check if GA is loaded
export const isGALoaded = () => {
  return GA_ENABLED && typeof window !== 'undefined' && !!window.gtag;
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackRegistration,
  trackLogin,
  trackPayment,
  trackSearch,
  setUserId,
  isGALoaded
};
