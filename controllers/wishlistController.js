const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'title price images', // Select only the necessary fields
    });

    // If no wishlist exists, return an empty items array
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Ensure the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create the user's wishlist
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [] });
    }

    // Check if the product is already in the wishlist
    if (!wishlist.items.some((item) => item.productId.toString() === productId)) {
      wishlist.items.push({ productId });
      await wishlist.save();
    }

    // Populate the updated wishlist and return it
    const updatedWishlist = await Wishlist.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'title price images',
    });

    res.status(200).json(updatedWishlist);
  } catch (error) {
    next(error);
  }
};


// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:itemId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Remove the item from the wishlist
    wishlist.items = wishlist.items.filter((item) => item._id.toString() !== itemId);
    await wishlist.save();

    // Populate the updated wishlist and return it
    const updatedWishlist = await Wishlist.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'title price images',
    });

    res.status(200).json(updatedWishlist);
  } catch (error) {
    next(error);
  }
};
