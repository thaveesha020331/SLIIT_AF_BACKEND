import express from 'express';
import {
  processCardPayment,
  processCashOnDelivery,
  getPaymentStatus,
  getPaymentByOrderId,
  refundPayment,
} from '../../controllers/Thaveesha/paymentController.js';
import { protect } from '../../utils/Tudakshana/authMiddleware.js';

const router = express.Router();
router.use(protect);

// Process payments
router.post('/process-card', processCardPayment);
router.post('/process-cod', processCashOnDelivery);

// Get payment information - order route MUST come before paymentId route
router.get('/order/:orderId', getPaymentByOrderId);
router.get('/:paymentId', getPaymentStatus);

// Refund payment
router.post('/:paymentId/refund', refundPayment);

export default router;
