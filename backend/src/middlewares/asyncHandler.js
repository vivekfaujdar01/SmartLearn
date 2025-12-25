// Async Handler Middleware - Wrapper for async route handlers
// src/middlewares/asyncHandler.js

/**
 * Async Handler - Wraps async functions to catch errors automatically
 * Eliminates the need for try-catch blocks in every controller
 * 
 * @param fn - Async function (controller) to wrap
 * @returns Wrapped function that catches errors and passes to Express error handler
 * 
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
export default fn => (req, res, next) => {
  // Execute the async function and catch any rejected promises
  // Pass errors to Express error handling middleware via next(error)
  Promise.resolve(fn(req, res, next)).catch(next);
};
