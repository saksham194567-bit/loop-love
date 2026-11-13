import { Router } from 'express';
import { trackOrderByNumber, getMyOrders } from '../controllers/orderController.js';
import { authenticateCustomer } from '../middleware/authMiddleware.js';

const router = Router();

// Public Order Tracking Endpoint
router.get('/track/:orderNumber', trackOrderByNumber);

// Customer Order History Endpoint
router.get('/my-orders', authenticateCustomer, getMyOrders);

export default router;

