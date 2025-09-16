import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import paypal from '@paypal/checkout-server-sdk';

dotenv.config();

const router = express.Router();

// Initialize Stripe only if the secret key is available
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
}

// Initialize PayPal SDK environment
let paypalClient;
const paypalClientId = process.env.PAYPAL_CLIENT_ID;
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
const paypalEnv = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase(); // 'sandbox' | 'live'

if (paypalClientId && paypalClientSecret) {
  const environment = paypalEnv === 'live'
    ? new paypal.core.LiveEnvironment(paypalClientId, paypalClientSecret)
    : new paypal.core.SandboxEnvironment(paypalClientId, paypalClientSecret);
  paypalClient = new paypal.core.PayPalHttpClient(environment);
} else {
  console.warn('⚠️  PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not found. PayPal functionality will be disabled.');
}

// Test Stripe configuration
router.get('/test', (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.',
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0
    });
  }
  
  res.json({ 
    message: 'Stripe is properly configured',
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...' : 'Not set'
  });
});

// Public config for frontend (exposes only publishable/allowed keys)
router.get('/config', (req, res) => {
  res.json({
    stripe: {
      enabled: !!process.env.STRIPE_PUBLISHABLE_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    },
    paypal: {
      enabled: !!paypalClient,
      clientId: paypalClientId || null,
      env: paypalEnv,
    },
  });
});

// PayPal: create order
router.post('/paypal/create-order', async (req, res) => {
  if (!paypalClient) {
    return res.status(503).json({ error: 'PayPal not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.' });
  }

  try {
    const { amount, currency = 'USD', description } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: description || 'Payment',
        },
      ],
    });

    const order = await paypalClient.execute(request);
    return res.json({ id: order.result.id, status: order.result.status });
  } catch (error) {
    console.error('PayPal create order error:', error);
    return res.status(500).json({ error: 'Failed to create PayPal order', details: error.message });
  }
});

// PayPal: capture order
router.post('/paypal/capture-order', async (req, res) => {
  if (!paypalClient) {
    return res.status(503).json({ error: 'PayPal not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.' });
  }

  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const capture = await paypalClient.execute(request);
    return res.json({ status: capture.result.status, id: capture.result.id, result: capture.result });
  } catch (error) {
    console.error('PayPal capture order error:', error);
    return res.status(500).json({ error: 'Failed to capture PayPal order', details: error.message });
  }
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    console.log('Creating payment intent with:', { amount, currency, metadata });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created successfully:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      clientSecret: paymentIntent.client_secret ? 'Present' : 'Missing'
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message,
      type: error.type
    });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { paymentIntentId } = req.body;
    
    console.log('Confirming payment intent:', paymentIntentId);

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Retrieved payment intent:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
    
    if (paymentIntent.status === 'succeeded') {
      res.json({ 
        success: true, 
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      });
    } else {
      res.json({ 
        success: false, 
        status: paymentIntent.status,
        error: paymentIntent.last_payment_error?.message || 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ 
      error: 'Failed to confirm payment',
      details: error.message,
      type: error.type
    });
  }
});

// Get payment history
router.get('/payment-history/:userId', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { userId } = req.params;
    
    const payments = await stripe.paymentIntents.list({
      limit: 100,
      metadata: { userId },
    });

    const formattedPayments = payments.data.map(payment => ({
      id: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      created: new Date(payment.created * 1000),
      metadata: payment.metadata,
    }));

    res.json({ payments: formattedPayments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET not found. Webhook verification disabled.');
    return res.status(503).json({ 
      error: 'Webhook secret not configured. Please set STRIPE_WEBHOOK_SECRET in environment variables.' 
    });
  }

  // For webhooks, we need the raw body as a buffer
  // Note: This route should be configured with raw body parsing in your main server file
  // or you can use a different approach for webhook handling
  let event;

  try {
    // For now, we'll skip webhook signature verification until proper body parsing is set up
    console.log('Webhook received:', req.body);
    res.json({ received: true, note: 'Webhook signature verification requires raw body parsing setup' });
    return;
    
    // Uncomment this when you have proper webhook body parsing set up:
    // event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you can add logic to update your database, send confirmation emails, etc.
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Here you can add logic to handle failed payments
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
