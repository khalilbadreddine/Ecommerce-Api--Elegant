// controllers/adminController.js
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product'); // Assuming you have a Product model

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new product (Admin only)
// @route   POST /api/admin/products
// @access  Admin
exports.addProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock } = req.body;
    const product = new Product({ title, description, price, stock });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/admin/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
