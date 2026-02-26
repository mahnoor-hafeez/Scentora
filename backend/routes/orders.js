import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Customer'), createOrder);
router.get('/my', authorize('Customer'), getMyOrders);
router.get('/seller', authorize('Seller', 'Admin'), getSellerOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('Seller', 'Admin'), updateOrderStatus);

export default router;
