import { Router } from 'express';
import {
  getAdminOrders,
  updateOrderStatus,
  deleteOrder,
  getStats,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require admin role
router.use(requireAdmin);

router.get('/orders', getAdminOrders);
router.patch('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);
router.get('/stats', getStats);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
