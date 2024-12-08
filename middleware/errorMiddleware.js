// middleware/errorMiddleware.js

exports.errorHandler = (err, req, res, next) => {
    // Log the error stack trace for debugging
    console.error(err.stack);
  
    // Set the response status code
    const statusCode = err.statusCode || 500;
  
    // Respond with the error message and stack trace (if not in production)
    res.status(statusCode).json({
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  