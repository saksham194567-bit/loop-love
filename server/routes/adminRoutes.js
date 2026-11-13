import { Router } from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAdminOrders,
  updateOrderStatus,
  getAdminCustomers,
  getAdminInventory,
  updateInventoryItem,
  getAdminContactMessages,
  markContactMessageRead,
  getAdminNewsletterSubscribers,
} from '../controllers/adminController.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { updateStoreSettings } from '../controllers/settingsController.js';
import { authenticateAdmin } from '../middleware/adminMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Admin Authentication
router.post('/login', authLimiter, adminLogin);

// Protected Admin Operations
router.use(authenticateAdmin);

router.get('/stats', getDashboardStats);
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/customers', getAdminCustomers);
router.get('/inventory', getAdminInventory);
router.put('/inventory/:id', updateInventoryItem);
router.get('/contact-messages', getAdminContactMessages);
router.put('/contact-messages/:id/read', markContactMessageRead);
router.get('/newsletter-subscribers', getAdminNewsletterSubscribers);

// Admin Product Management
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Admin Settings
router.put('/settings', updateStoreSettings);

export default router;

