// src/middlewares/errorHandler.js

export const errorHandler = (err, req, res) => {
    // Log the error for debugging (you can use a logger library instead of console.log)
    console.error(err.stack);
  
    // Custom error response
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
    const errorResponse = {
      status: 'error',
      statusCode,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Send stack trace only in development
    };
  
    // Send the response
    res.status(statusCode).send(errorResponse);
  };
  