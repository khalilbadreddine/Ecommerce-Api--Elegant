const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Product name
  description: { type: String, required: true }, // Detailed description
  price: { type: Number, required: true }, // Current price
  oldPrice: { type: Number }, // Original price before discount
  rating: { type: Number, default: 0 }, // Average customer rating
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category
  sales: { type: Number, default: 0 }, // Number of units sold
  images: { type: [String], required: true }, // URLs of product images
  colors: { type: [String] }, // Available colors (hex codes)
  offerExpiry: { type: Date }, // Discount expiration date
  stockQuantity: { type: Number, required: true }, // Items in stock
  inStock: { type: Boolean, default: true }, // Stock availability
  additionalInfo: { type: [String] }, // Additional product details
}, { timestamps: true });

// Middleware to update 'inStock' based on 'stockQuantity'
productSchema.pre('save', function(next) {
  this.inStock = this.stockQuantity > 0;
  next();
});

module.exports = mongoose.model('Product', productSchema);
