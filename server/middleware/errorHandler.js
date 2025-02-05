const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Add this block for duplicate key errors
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ 
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;