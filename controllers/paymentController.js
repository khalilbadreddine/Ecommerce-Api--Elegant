// controllers/paymentController.js

const Payment = require('../models/Payment');
const Order = require('../models/Order');
// Import payment gateway SDK (e.g., Stripe)
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { validationResult } = require('express-validator');

// @desc    Initiate payment process for an order
// @route   POST /api/payments
// @access  Private
exports.initiatePayment = async (req, res, next) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentMethod } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId).populate('userId', 'email');

    if (!order) {
      // Order not found
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure that the user making the request owns the order
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to pay for this order' });
    }

    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment && existingPayment.status === 'success') {
      return res.status(400).json({ message: 'Payment has already been completed for this order' });
    }

    // Initiate payment with the payment gateway
    // For example, creating a payment intent with Stripe
    /*
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100, // Amount in smallest currency unit (e.g., cents)
      currency: 'usd',
      payment_method_types: ['card'], // Adjust based on paymentMethod
      metadata: { orderId: order._id.toString() },
    });
    */

    // Create a new payment record in the database
    const payment = new Payment({
      orderId: order._id,
      amount: order.totalPrice,
      paymentMethod,
      status: 'pending',
      // You may store additional data like paymentIntentId
      // paymentIntentId: paymentIntent.id,
    });

    await payment.save();

    // Respond with client secret or necessary data for the front-end to complete payment
    res.status(201).json({
      message: 'Payment initiated',
      paymentId: payment._id,
      // clientSecret: paymentIntent.client_secret, // For Stripe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle payment success callback/webhook
// @route   POST /api/payments/success
// @access  Public (Webhook endpoint)
// Note: Secure this endpoint to accept requests only from your payment provider
exports.paymentSuccess = async (req, res, next) => {
  try {
    // Extract necessary information from the request
    // This depends on your payment provider's webhook data
    // For example, with Stripe:
    /*
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    */

    // Example data extraction (replace with actual data)
    const { paymentId, orderId } = req.body;

    // Find the payment record
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status to 'success'
    payment.status = 'success';
    await payment.save();

    // Update order status to 'processed' or appropriate status
    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'processed';
      await order.save();
    }

    // Respond with success (200 OK)
    res.json({ message: 'Payment successful and order updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Public (Webhook endpoint)
exports.paymentFailure = async (req, res, next) => {
  try {
    // Extract necessary information from the request
    const { paymentId, orderId, reason } = req.body;

    // Find the payment record
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status to 'failed' and add failure reason
    payment.status = 'failed';
    payment.failureReason = reason;
    await payment.save();

    // Optionally, update order status to 'payment failed'
    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'payment failed';
      await order.save();
    }

    // Respond with success (200 OK)
    res.json({ message: 'Payment failed status updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private (Admin or the user who made the payment)
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('orderId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Ensure that the user is authorized to view the payment
    if (
      payment.orderId.userId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized to view this payment' });
    }

    // Respond with payment details
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res, next) => {
  try {
    // Only admins can access this
    const payments = await Payment.find().populate('orderId');

    // Respond with all payments
    res.json(payments);
  } catch (error) {
    next(error);
  }
};
