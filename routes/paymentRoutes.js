// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
  getPaymentDetails,
  getAllPayments,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Protected route for initiating payment
router.post(
  '/',
  protect,
  [
    // Validation checks for initiating payment
    check('orderId', 'Order ID is required').notEmpty(),
    check('paymentMethod', 'Payment method is required').notEmpty(),
  ],
  initiatePayment
);

// Webhook endpoints (ensure security)
router.post('/success', paymentSuccess);
router.post('/failure', paymentFailure);

// Protected route to get payment details
router.get('/:id', protect, getPaymentDetails);

// Admin route to get all payments
router.get('/', protect, admin, getAllPayments);

module.exports = router;
