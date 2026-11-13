import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'loop_and_love_jwt_super_secret_key_change_in_production_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || 'loop_and_love_admin_jwt_secret_key_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000',
  
  // Payment Gateway (Razorpay Indian Payments)
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  IS_PAYMENT_TEST_MODE: process.env.IS_PAYMENT_TEST_MODE !== 'false', // Default test mode
  
  // Shipping Configuration
  FREE_SHIPPING_THRESHOLD: Number(process.env.FREE_SHIPPING_THRESHOLD) || 1499,
  STANDARD_SHIPPING_FEE: Number(process.env.STANDARD_SHIPPING_FEE) || 79,
  
  // Brand Contact Details
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'care@loopandlove.in',
  SUPPORT_WHATSAPP: process.env.SUPPORT_WHATSAPP || '+91 98765 43210',
};

export default config;

