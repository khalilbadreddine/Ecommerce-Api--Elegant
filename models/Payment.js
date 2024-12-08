const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Related order
  amount: { type: Number, required: true }, // Payment amount
  paymentMethod: { type: String, required: true }, // Method used (e.g., 'credit card')
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'success', 'failed'],
  }, // Payment status
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
