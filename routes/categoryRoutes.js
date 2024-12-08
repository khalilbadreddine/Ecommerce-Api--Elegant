// routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  admin,
  [
    // Validation checks for creating a category
    check('name', 'Name is required').notEmpty(),
  ],
  createCategory
);

router.put(
  '/:id',
  protect,
  admin,
  [
    // Validation checks for updating a category
    check('name', 'Name must not be empty').optional().notEmpty(),
  ],
  updateCategory
);

router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
