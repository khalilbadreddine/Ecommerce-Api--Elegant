// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (authentication)
exports.protect = async (req, res, next) => {
  let token;

  // Check if the token is provided in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token payload and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user is an admin (authorization)
exports.admin = (req, res, next) => {
  // Check if user is authenticated and is an admin
  if (req.user && req.user.role === 'admin') {
    // User is an admin, proceed
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin only' });
  }
};
