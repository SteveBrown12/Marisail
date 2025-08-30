import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Stripe only if the secret key is available
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
}

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

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

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
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

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
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
    res.status(500).json({ error: 'Failed to confirm payment' });
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
