// controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors if any
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists with the same email
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists, return error
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance
    const user = new User({
      name,
      email,
      password, // Password will be hashed in User model's pre-save hook
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Token expires in 30 days
    });

    // Respond with user data and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors if any
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password does not match
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Respond with user data and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    // req.user is set in auth middleware after token verification
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      // User not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user profile data
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      // User not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      // Update password (will be hashed in pre-save middleware)
      user.password = req.body.password;
    }

    // Save updated user to database
    await user.save();

    // Respond with updated user data
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Additional admin-specific controllers can be added, such as:
// - getUsers: GET /api/users (admin)
// - deleteUser: DELETE /api/users/:id (admin)
// - getUserById: GET /api/users/:id (admin)
// - updateUser: PUT /api/users/:id (admin)
