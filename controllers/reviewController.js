// controllers/reviewController.js

const Review = require('../models/Review');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Add a review to a product
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      userId: req.user.id,
      productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Create review
    const review = new Review({
      userId: req.user.id,
      productId,
      rating: Number(rating),
      comment,
    });

    // Save review to database
    await review.save();

    // Update product's average rating
    const reviews = await Review.find({ productId });

    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    // Respond with success message
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Fetch reviews for the product
    const reviews = await Review.find({ productId }).populate('userId', 'name');

    // Respond with reviews
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
