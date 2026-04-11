import express from 'express';
import {
  processCardPayment,
  processCashOnDelivery,
  getPaymentStatus,
  getPaymentByOrderId,
  refundPayment,
} from '../../controllers/Tudakshana/paymentController.js';
import { protect } from '../../utils/Tudakshana/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/process-card', processCardPayment);
router.post('/process-cod', processCashOnDelivery);

router.get('/order/:orderId', getPaymentByOrderId);
router.get('/:paymentId', getPaymentStatus);

router.post('/:paymentId/refund', refundPayment);

export default router;
