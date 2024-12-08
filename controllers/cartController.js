const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Import the Product model

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    // Find the cart for the logged-in user and populate product details
    let cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'title price images', // Include only these fields from the Product model
    });

    if (!cart) {
      // If no cart exists, create an empty one
      cart = new Cart({
        userId: req.user.id,
        items: [],
      });
      await cart.save();
    }

    // Respond with the cart, including populated product details
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};



// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate the quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item to update
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the item's quantity
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    // Populate and respond with the updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title price images',
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};




// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    // Find the product to ensure it exists and get its images
    const product = await Product.findById(productId, 'images');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const firstImage = product.images[0] || null; // Get the first image, or null if not available

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [],
      });
    }

    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      // If exists, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Otherwise, add the new item
      cart.items.push({ productId, quantity, image: firstImage });
    }

    // Save the cart
    await cart.save();

    // Populate the updated cart to include product details
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title price images',
    });

    // Respond with the updated cart
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Find the cart for the user
    const cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      // Remove the item from the cart
      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

      // Save the updated cart
      await cart.save();

      // Populate and respond with the updated cart
      const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.productId',
        select: 'title price images',
      });

      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      // Clear the items array
      cart.items = [];

      // Save the cleared cart
      await cart.save();

      res.status(200).json({ message: 'Cart cleared successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    next(error);
  }
};
