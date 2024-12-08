const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Full name of the user
  email: { type: String, unique: true, required: true, index: true }, // Unique email address
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' }, // User role
  phone: { type: String }, // Contact number
  address: [{
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  }],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified
  this.password = await bcrypt.hash(this.password, 12); // Hash the password
  next();
});

module.exports = mongoose.model('User', userSchema);
