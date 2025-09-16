import axios from 'axios';

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const GA_ENABLED = process.env.NODE_ENV === 'production' || process.env.GA_ENABLED === 'true';

class AnalyticsService {
  constructor() {
    this.measurementId = GA_MEASUREMENT_ID;
    this.enabled = GA_ENABLED;
    this.apiSecret = process.env.GA_API_SECRET;
    this.baseUrl = 'https://www.google-analytics.com/mp/collect';
  }

  /**
   * Send event to Google Analytics 4
   * @param {Object} eventData - Event data object
   */
  async sendEvent(eventData) {
    if (!this.enabled || !this.apiSecret) {
      console.log('Analytics disabled or missing API secret');
      return;
    }

    try {
      const payload = {
        client_id: eventData.clientId || 'server-side',
        events: [{
          name: eventData.name,
          params: eventData.params || {}
        }]
      };

      const url = `${this.baseUrl}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`;
      
      await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Analytics event sent:', eventData.name);
    } catch (error) {
      console.error('Failed to send analytics event:', error.message);
    }
  }

  /**
   * Track user registration
   */
  async trackRegistration(userData) {
    await this.sendEvent({
      name: 'sign_up',
      params: {
        method: userData.method || 'email',
        user_id: userData.userId,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName
      }
    });
  }

  /**
   * Track user login
   */
  async trackLogin(userData) {
    await this.sendEvent({
      name: 'login',
      params: {
        method: userData.method || 'email',
        user_id: userData.userId,
        email: userData.email
      }
    });
  }

  /**
   * Track payment events
   */
  async trackPayment(paymentData) {
    await this.sendEvent({
      name: 'payment_attempt',
      params: {
        payment_method: paymentData.paymentMethod,
        value: paymentData.amount,
        currency: paymentData.currency || 'USD',
        payment_id: paymentData.paymentId,
        user_id: paymentData.userId,
        success: paymentData.success
      }
    });

    if (paymentData.success) {
      await this.sendEvent({
        name: 'purchase',
        params: {
          transaction_id: paymentData.paymentId,
          value: paymentData.amount,
          currency: paymentData.currency || 'USD',
          payment_method: paymentData.paymentMethod,
          user_id: paymentData.userId
        }
      });
    }
  }

  /**
   * Track search queries
   */
  async trackSearch(searchData) {
    await this.sendEvent({
      name: 'search',
      params: {
        search_term: searchData.query,
        results_count: searchData.resultsCount,
        service_type: searchData.serviceType,
        user_id: searchData.userId
      }
    });
  }

  /**
   * Track page views
   */
  async trackPageView(pageData) {
    await this.sendEvent({
      name: 'page_view',
      params: {
        page_title: pageData.title,
        page_location: pageData.url,
        page_path: pageData.path
      }
    });
  }

  /**
   * Track custom events
   */
  async trackCustomEvent(eventName, parameters = {}) {
    await this.sendEvent({
      name: eventName,
      params: parameters
    });
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Get measurement ID
   */
  getMeasurementId() {
    return this.measurementId;
  }
}

export default new AnalyticsService();

