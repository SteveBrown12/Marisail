import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import paypal from '@paypal/checkout-server-sdk';
import Razorpay from 'razorpay';
import Flutterwave from 'flutterwave-node-v3';
import exchangeRateService from '../services/exchangeRateService.js';

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

// Initialize Razorpay
let razorpay;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (razorpayKeyId && razorpayKeySecret) {
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
} else {
  console.warn('⚠️  RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found. Razorpay functionality will be disabled.');
}

// Initialize Flutterwave
let flutterwave;
const flutterwavePublicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
const flutterwaveEncryptionKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY;

if (flutterwavePublicKey && flutterwaveSecretKey) {
  flutterwave = new Flutterwave(flutterwavePublicKey, flutterwaveSecretKey);
} else {
  console.warn('⚠️  FLUTTERWAVE_PUBLIC_KEY or FLUTTERWAVE_SECRET_KEY not found. Flutterwave functionality will be disabled.');
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
    razorpay: {
      enabled: !!razorpay,
      keyId: razorpayKeyId || null,
    },
    flutterwave: {
      enabled: !!flutterwave,
      publicKey: flutterwavePublicKey || null,
    },
  });
});

// Get currency metadata and rounding info
router.get('/currency/:code', (req, res) => {
  const { code } = req.params;
  const metadata = exchangeRateService.getCurrencyMetadata(code.toUpperCase());

  // Example rounding for a £10 equivalent amount
  const exampleAmount = 10.56;
  const roundedAmount = exchangeRateService.roundForPayment(exampleAmount, code.toUpperCase());
  const stripeAmount = exchangeRateService.prepareAmountForStripe(roundedAmount, code.toUpperCase());

  res.json({
    currency: code.toUpperCase(),
    metadata,
    example: {
      originalAmount: exampleAmount,
      roundedAmount: roundedAmount,
      stripeAmount: stripeAmount,
      description: `For ${code.toUpperCase()}, ${exampleAmount} rounds to ${roundedAmount} (Stripe: ${stripeAmount})`
    }
  });
});

// Round amount for specific currency (utility endpoint)
router.post('/round-amount', (req, res) => {
  const { amount, currency = 'USD' } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  const roundedAmount = exchangeRateService.roundForPayment(amount, currency.toUpperCase());
  const stripeAmount = exchangeRateService.prepareAmountForStripe(roundedAmount, currency.toUpperCase());
  const metadata = exchangeRateService.getCurrencyMetadata(currency.toUpperCase());

  res.json({
    currency: currency.toUpperCase(),
    originalAmount: amount,
    roundedAmount: roundedAmount,
    stripeAmount: stripeAmount,
    metadata: metadata
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

    // Apply smart rounding based on currency
    const roundedAmount = exchangeRateService.roundForPayment(amount, currency);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: roundedAmount.toFixed(2),
          },
          description: description || 'Payment',
        },
      ],
    });

    const order = await paypalClient.execute(request);
    return res.json({
      id: order.result.id,
      status: order.result.status,
      amount: roundedAmount,
      originalAmount: amount
    });
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

    // Apply smart rounding based on currency
    const roundedAmount = exchangeRateService.roundForPayment(amount, currency);
    const stripeAmount = exchangeRateService.prepareAmountForStripe(roundedAmount, currency);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency,
      metadata: {
        ...metadata,
        originalAmount: amount,
        roundedAmount: roundedAmount
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created successfully:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      roundedAmount: roundedAmount,
      clientSecret: paymentIntent.client_secret ? 'Present' : 'Missing'
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: roundedAmount,
      originalAmount: amount
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

// Create Apple Pay payment intent
router.post('/create-apple-pay-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    console.log('Creating Apple Pay payment intent with:', { amount, currency, metadata });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        payment_method: 'apple_pay'
      },
      payment_method_types: ['apple_pay'],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
    });

    console.log('Apple Pay payment intent created successfully:', {
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
    console.error('Error creating Apple Pay payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create Apple Pay payment intent',
      details: error.message,
      type: error.type
    });
  }
});

// Create Google Pay payment intent
router.post('/create-google-pay-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    console.log('Creating Google Pay payment intent with:', { amount, currency, metadata });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        payment_method: 'google_pay'
      },
      payment_method_types: ['google_pay'],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
    });

    console.log('Google Pay payment intent created successfully:', {
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
    console.error('Error creating Google Pay payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create Google Pay payment intent',
      details: error.message,
      type: error.type
    });
  }
});

// Create Alipay payment intent
router.post('/create-alipay-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    console.log('Creating Alipay payment intent with:', { amount, currency, metadata });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        payment_method: 'alipay'
      },
      payment_method_types: ['alipay'],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      },
    });

    console.log('Alipay payment intent created successfully:', {
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
    console.error('Error creating Alipay payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create Alipay payment intent',
      details: error.message,
      type: error.type
    });
  }
});

// Create WeChat Pay payment intent
router.post('/create-wechat-pay-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    console.log('Creating WeChat Pay payment intent with:', { amount, currency, metadata });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        payment_method: 'wechat_pay'
      },
      payment_method_types: ['wechat_pay'],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      },
    });

    console.log('WeChat Pay payment intent created successfully:', {
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
    console.error('Error creating WeChat Pay payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create WeChat Pay payment intent',
      details: error.message,
      type: error.type
    });
  }
});

// Create Klarna payment intent
router.post('/create-klarna-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    console.log('Creating Klarna payment intent with:', { amount, currency, metadata });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        payment_method: 'klarna'
      },
      payment_method_types: ['klarna'],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      },
    });

    console.log('Klarna payment intent created successfully:', {
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
    console.error('Error creating Klarna payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create Klarna payment intent',
      details: error.message,
      type: error.type
    });
  }
});

// Create Razorpay order
router.post('/razorpay/create-order', async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({
      error: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.'
    });
  }

  try {
    const { amount, currency = 'INR', metadata = {} } = req.body;

    console.log('Creating Razorpay order with:', { amount, currency, metadata });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Apply smart rounding based on currency
    const roundedAmount = exchangeRateService.roundForPayment(amount, currency);

    // Razorpay amounts are in smallest currency unit (paise for INR)
    const razorpayAmount = Math.round(roundedAmount * 100);

    const options = {
      amount: razorpayAmount,
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      notes: metadata,
    };

    const order = await razorpay.orders.create(options);

    console.log('Razorpay order created successfully:', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

    res.json({
      orderId: order.id,
      amount: roundedAmount,
      currency: order.currency,
      originalAmount: amount,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create Razorpay order',
      details: error.message,
    });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify-payment', async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({
      error: 'Razorpay is not configured.'
    });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log('Verifying Razorpay payment:', { razorpay_order_id, razorpay_payment_id });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment verification parameters' });
    }

    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha256', razorpayKeySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      console.log('Razorpay payment verified successfully');
      res.json({
        success: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.error('Razorpay signature verification failed');
      res.status(400).json({
        success: false,
        error: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({
      error: 'Failed to verify Razorpay payment',
      details: error.message,
    });
  }
});

// Initialize Flutterwave payment
router.post('/flutterwave/initialize-payment', async (req, res) => {
  if (!flutterwave) {
    return res.status(503).json({
      error: 'Flutterwave is not configured. Please set FLUTTERWAVE_PUBLIC_KEY and FLUTTERWAVE_SECRET_KEY in environment variables.'
    });
  }

  try {
    const { amount, currency = 'USD', email, name, phone, metadata = {} } = req.body;

    console.log('Initializing Flutterwave payment with:', { amount, currency, email });

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required for Flutterwave payments' });
    }

    // Apply smart rounding based on currency
    const roundedAmount = exchangeRateService.roundForPayment(amount, currency);

    const payload = {
      tx_ref: `tx_${Date.now()}`,
      amount: roundedAmount,
      currency: currency.toUpperCase(),
      redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`,
      payment_options: 'card,banktransfer,ussd',
      customer: {
        email: email,
        name: name || 'Customer',
        phonenumber: phone || '',
      },
      customizations: {
        title: 'Payment',
        description: metadata.description || 'Payment for service',
        logo: '',
      },
      meta: metadata,
    };

    const response = await flutterwave.Charge.card(payload);

    console.log('Flutterwave payment initialized:', {
      status: response.status,
      message: response.message,
    });

    res.json({
      status: response.status,
      message: response.message,
      data: response.data,
      link: response.data?.link,
      amount: roundedAmount,
      originalAmount: amount,
    });
  } catch (error) {
    console.error('Error initializing Flutterwave payment:', error);
    res.status(500).json({
      error: 'Failed to initialize Flutterwave payment',
      details: error.message,
    });
  }
});

// Verify Flutterwave payment
router.post('/flutterwave/verify-payment', async (req, res) => {
  if (!flutterwave) {
    return res.status(503).json({
      error: 'Flutterwave is not configured.'
    });
  }

  try {
    const { transaction_id } = req.body;

    console.log('Verifying Flutterwave payment:', { transaction_id });

    if (!transaction_id) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const response = await flutterwave.Transaction.verify({ id: transaction_id });

    console.log('Flutterwave payment verification response:', {
      status: response.status,
      amount: response.data?.amount,
    });

    if (response.status === 'success' && response.data.status === 'successful') {
      res.json({
        success: true,
        transactionId: transaction_id,
        amount: response.data.amount,
        currency: response.data.currency,
        status: response.data.status,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed',
        status: response.data?.status,
      });
    }
  } catch (error) {
    console.error('Error verifying Flutterwave payment:', error);
    res.status(500).json({
      error: 'Failed to verify Flutterwave payment',
      details: error.message,
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
