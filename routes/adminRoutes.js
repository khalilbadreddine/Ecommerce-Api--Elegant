// routes/adminRoutes.js
const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllOrders,
  updateOrderStatus,
  addProduct,
  deleteProduct
} = require('../controllers/adminController');

const router = express.Router();

// Orders
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

// Products
router.post('/products', protect, admin, addProduct);
router.delete('/products/:id', protect, admin, deleteProduct);

module.exports = router;
