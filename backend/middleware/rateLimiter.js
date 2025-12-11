const rateLimit = require('express-rate-limit');

// Skip rate limiting in test environment
const skipRateLimit = process.env.NODE_ENV === 'test';

// General API rate limiter - 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: skipRateLimit ? 10000 : 100, // Very high limit in test mode
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: () => skipRateLimit, // Skip rate limiting in test mode
});

// Stricter rate limiter for authentication endpoints - 5 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: skipRateLimit ? 10000 : 5, // Very high limit in test mode
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skip: () => skipRateLimit, // Skip rate limiting in test mode
});

// Very strict rate limiter for login endpoint - 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: skipRateLimit ? 10000 : 5, // Very high limit in test mode
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skip: () => skipRateLimit, // Skip rate limiting in test mode
});

module.exports = {
  generalLimiter,
  authLimiter,
  loginLimiter
};

