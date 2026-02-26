import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getMyProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/my', protect, authorize('Seller'), getMyProducts);
router.get('/:id', getSingleProduct);

router.post('/', protect, authorize('Seller'), upload.array('images', 5), createProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
