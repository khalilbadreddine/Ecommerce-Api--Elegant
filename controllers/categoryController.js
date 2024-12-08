// controllers/categoryController.js

const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    // Fetch categories from the database
    const categories = await Category.find();

    // Respond with categories
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res, next) => {
  try {
    // Find category by ID
    const category = await Category.findById(req.params.id);

    if (category) {
      // Respond with category data
      res.json(category);
    } else {
      // Category not found
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    // Only admins can create categories
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parentCategory } = req.body;

    // Check if category with the same name exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create new category
    const category = new Category({
      name,
      description,
      parentCategory,
    });

    // Save category to the database
    await category.save();

    // Respond with created category
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory } = req.body;

    // Find category by ID
    const category = await Category.findById(req.params.id);

    if (category) {
      // Update category fields
      category.name = name || category.name;
      category.description = description || category.description;
      category.parentCategory = parentCategory || category.parentCategory;

      // Save updated category
      const updatedCategory = await category.save();

      // Respond with updated category
      res.json(updatedCategory);
    } else {
      // Category not found
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    // Find category by ID
    const category = await Category.findById(req.params.id);

    if (category) {
      // Remove category from database
      await category.remove();

      // Respond with success message
      res.json({ message: 'Category removed' });
    } else {
      // Category not found
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};
