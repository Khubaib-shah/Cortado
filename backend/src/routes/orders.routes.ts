import { Router } from 'express';
import { createOrder, getUserOrders, trackOrder } from '../controllers/orders.controller';
import { requireAuth } from '../middleware/auth';
import { trackRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', createOrder);
router.get('/', requireAuth, getUserOrders);
router.get('/track', trackRateLimiter, trackOrder);

export default router;
