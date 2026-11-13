export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : process.env.NODE_ENV === 'production'
    ? 'An unexpected internal error occurred on our server. Please try again shortly.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

