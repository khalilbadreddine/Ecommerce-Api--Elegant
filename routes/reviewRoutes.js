// routes/reviewRoutes.js

const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access productId
const {
  createReview,
  getReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Public routes
router.get('/', getReviews);

// Protected routes
router.post(
  '/',
  protect,
  [
    // Validation checks for creating a review
    check('rating', 'Rating is required and must be between 1 and 5').isInt({
      min: 1,
      max: 5,
    }),
    check('comment', 'Comment is required').notEmpty(),
  ],
  createReview
);

module.exports = router;
