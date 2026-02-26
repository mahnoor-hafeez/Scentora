import express from 'express';
import {
  getPendingSellers,
  approveSeller,
  getUsers,
  getAnalytics,
  getAllOrders,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/sellers/pending', getPendingSellers);
router.put('/sellers/:id/approve', approveSeller);
router.get('/users', getUsers);
router.get('/analytics', getAnalytics);
router.get('/orders', getAllOrders);

export default router;
