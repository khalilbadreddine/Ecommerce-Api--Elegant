// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Protected routes
router.post(
  '/',
  protect,
  [
    // Validation checks for adding order items
    check('orderItems', 'Order items cannot be empty').isArray({ min: 1 }),
    check('paymentMethod', 'Payment method is required').notEmpty(),
    check('totalPrice', 'Total price is required and must be a number').isFloat(),
  ],
  addOrderItems
);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
