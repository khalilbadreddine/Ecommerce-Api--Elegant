// controllers/orderController.js

const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    // Check if order items exist
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Create order instance
    const order = new Order({
      userId: req.user.id, // Set user ID from token
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    // Save order to the database
    const createdOrder = await order.save();

    // Update product stock and sales count
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity -= item.quantity;
        product.sales += item.quantity;
        await product.save();
      }
    }

    // Respond with created order
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    // Find order by ID and populate user and items
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'title price');

    if (order) {
      // Ensure that the user has access to this order
      if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to view this order' });
      }

      // Respond with order data
      res.json(order);
    } else {
      // Order not found
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    // Find orders for the logged-in user
    const orders = await Order.find({ userId: req.user.id });

    // Respond with the user's orders
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    // Only admins can access this
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'title price');

    // Respond with all orders
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Find order by ID
    const order = await Order.findById(req.params.id);

    if (order) {
      // Update order status
      order.status = status;
      order.updatedAt = Date.now();

      // Save updated order
      const updatedOrder = await order.save();

      // Respond with updated order
      res.json(updatedOrder);
    } else {
      // Order not found
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};
