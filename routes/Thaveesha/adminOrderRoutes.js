/**
 * Admin Order Routes - Thaveesha
 * Mounted at /api/admin/orders
 * All routes protected by protect middleware + inline admin role check
 */
import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getOrderByIdAdmin,
} from '../../controllers/Thaveesha/adminOrderController.js';
import { protect } from '../../utils/Tudakshana/authMiddleware.js';

const router = express.Router();

// Inline admin guard - does not rely on adminProtect export
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({
    success: false,
    message: 'Admin access only',
  });
};

router.use(protect, adminOnly);

router.get('/', getAllOrders);
router.get('/:id', getOrderByIdAdmin);
router.patch('/:id/status', updateOrderStatus);

export default router;