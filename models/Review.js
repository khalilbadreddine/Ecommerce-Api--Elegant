const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reviewer
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Product being reviewed
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
  comment: { type: String }, // Review text
}, { timestamps: true });

// Compound index to prevent multiple reviews by the same user on a product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
