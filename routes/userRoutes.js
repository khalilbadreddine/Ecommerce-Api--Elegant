// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  // Additional admin controllers can be added here
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Public routes
router.post(
  '/register',
  [
    // Validation checks for registration
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    // Validation checks for login
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes can be added here, e.g.:
// router.get('/', protect, admin, getUsers);

module.exports = router;
