import { rateLimit } from 'express-rate-limit';

// Rate limiter for OTP requests
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { message: 'Too many OTP requests. Please try again later.' }
});

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per window
  message: { message: 'Too many login attempts. Please try again later.' }
});