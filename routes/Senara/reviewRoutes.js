import express from 'express';
import { protect, restrictTo } from '../../utils/Tudakshana/authMiddleware.js';
import {
  getAllReviews,
  getMyReviews,
  getProductReviews,
  checkCanReview,
  addReview,
  updateReview,
  deleteReview,
  getReviewById,
} from '../../controllers/Senara/ReviewController.js';
import Review from '../../models/Senara/Review.js';

const router = express.Router();

// All routes require auth
router.use(protect);

// Admin: view all reviews
router.get('/', restrictTo('admin'), getAllReviews);

// Admin: delete any review
router.delete('/admin/:id', restrictTo('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await Review.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// customer, seller, admin can add/view their reviews
router.get('/my-reviews', restrictTo('customer', 'seller', 'admin'), getMyReviews);
router.get('/check/:productId', restrictTo('customer', 'seller', 'admin'), checkCanReview);
router.get('/product/:productId', getProductReviews);
router.post('/', restrictTo('customer', 'seller', 'admin'), addReview);
router.get('/:id', restrictTo('customer', 'seller', 'admin'), getReviewById);
router.patch('/:id', restrictTo('customer', 'seller', 'admin'), updateReview);
router.delete('/:id', restrictTo('customer', 'seller', 'admin'), deleteReview);

export default router;