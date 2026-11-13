import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  getAddresses,
  addAddress,
  deleteAddress,
  forgotPassword,
} from '../controllers/authController.js';
import { authenticateCustomer } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);

// Customer Protected Routes
router.get('/me', authenticateCustomer, getMe);
router.put('/profile', authenticateCustomer, updateProfile);
router.get('/addresses', authenticateCustomer, getAddresses);
router.post('/addresses', authenticateCustomer, addAddress);
router.delete('/addresses/:id', authenticateCustomer, deleteAddress);

export default router;

