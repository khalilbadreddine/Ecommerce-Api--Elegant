const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItem, // Import the new controller
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Protected routes
router.get('/', protect, getCart);

router.post(
  '/',
  protect,
  [
    check('productId', 'Product ID is required').notEmpty(),
    check('quantity', 'Quantity is required and must be at least 1').isInt({ min: 1 }),
  ],
  addToCart
);

router.put('/:itemId', protect, updateCartItem); // Add this line for updating quantity

router.delete('/:itemId', protect, removeFromCart);

router.delete('/', protect, clearCart);

module.exports = router;
