import express from 'express';
import { protect, restrictTo } from '../../utils/Tudakshana/authMiddleware.js';
import {
  getMyReviews,
  getProductReviews,
  checkCanReview,
  addReview,
  updateReview,
  deleteReview,
  getReviewById,
} from '../../controllers/Senara/ReviewController.js';

const router = express.Router();

// All routes require auth
router.use(protect);

// Order matters: specific paths before :id
// customer, seller, admin can add/view their reviews (sellers can buy and review)
router.get('/my-reviews', restrictTo('customer', 'seller', 'admin'), getMyReviews);
router.get('/check/:productId', restrictTo('customer', 'seller', 'admin'), checkCanReview);
router.get('/product/:productId', getProductReviews);
router.post('/', restrictTo('customer', 'seller', 'admin'), addReview);
router.get('/:id', restrictTo('customer', 'seller', 'admin'), getReviewById);
router.patch('/:id', restrictTo('customer', 'seller', 'admin'), updateReview);
router.delete('/:id', restrictTo('customer', 'seller', 'admin'), deleteReview);

export default router;
