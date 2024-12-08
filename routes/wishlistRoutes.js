const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:itemId', protect, removeFromWishlist);

module.exports = router;
