// controllers/productController.js

const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Fetch products from the database
    const products = await Product.find().populate('category');

    // Respond with products data
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    // Fetch product by ID
    const product = await Product.findById(req.params.id).populate('category');
    console.log(product);

    if (product) {
      // Respond with product data
      res.json(product);
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    // Only admins can create products (ensure to use admin middleware)
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract product data from request body
    const {
      title,
      description,
      price,
      category,
      stockQuantity,
      images,
    } = req.body;

    // Create a new product instance
    const product = new Product({
      title,
      description,
      price,
      category,
      stockQuantity,
      images,
      // Other fields can be set as needed
    });

    // Save product to the database
    const createdProduct = await product.save();

    // Respond with the created product
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update product fields
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.stockQuantity = req.body.stockQuantity || product.stockQuantity;
      product.images = req.body.images || product.images;
      // Update other fields as needed

      // Save updated product to the database
      const updatedProduct = await product.save();

      // Respond with updated product data
      res.json(updatedProduct);
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove product from the database
      await product.remove();

      // Respond with success message
      res.json({ message: 'Product removed' });
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};
