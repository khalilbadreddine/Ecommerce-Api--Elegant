const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Category name
  slug: { type: String, unique: true }, // URL-friendly version of the name
  description: { type: String }, // Category description
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // For subcategories
}, { timestamps: true });

// Middleware to generate slug before saving
categorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
