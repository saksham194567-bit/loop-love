import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/checkoutController.js';
import { optionalCustomerAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create-order', optionalCustomerAuth, createOrder);
router.post('/verify-payment', verifyPayment);

export default router;

