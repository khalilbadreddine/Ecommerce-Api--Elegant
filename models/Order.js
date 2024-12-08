const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Product reference
    quantity: { type: Number, required: true }, // Quantity ordered
    price: { type: Number, required: true }, // Price per unit at order time
  }],
  totalPrice: { type: Number, required: true }, // Total order amount
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processed', 'shipped', 'delivered', 'canceled'],
  }, // Order status
  paymentMethod: { type: String, required: true }, // Payment type
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
