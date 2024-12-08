// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Import the review router
const reviewRouter = require('./reviewRoutes');

// Nested route for reviews
// This will forward requests to /api/products/:productId/reviews to the reviewRouter
router.use('/:productId/reviews', reviewRouter);

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  admin,
  [
    // Validation checks for creating a product
    check('title', 'Title is required').notEmpty(),
    check('price', 'Price is required and must be a number').isFloat(),
    check('category', 'Category is required').notEmpty(),
    check('stockQuantity', 'Stock quantity is required').isInt({ min: 0 }),
    check('images', 'At least one image URL is required').isArray({ min: 1 }),
  ],
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  [
    // Validation checks for updating a product
    check('price', 'Price must be a number').optional().isFloat(),
    check('stockQuantity', 'Stock quantity must be an integer').optional().isInt({ min: 0 }),
  ],
  updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
