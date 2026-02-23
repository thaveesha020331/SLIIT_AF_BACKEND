import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../../components/Senara/StarRating';
import reviewService from '../../services/Senara/reviewService';
import './MyReviewPage.css';

const MyReviewPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reviewService.getMyReviews();
      setReviews(res.data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) return;
      setError(err.response?.data?.message || 'Failed to load your reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (review) => {
    const productId = review.product?._id || review.product;
    if (productId) {
      navigate(`/products/${productId}/review`);
    }
  };

  const handleDeleteReview = async (e, reviewId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setError('');
    try {
      await reviewService.deleteReview(reviewId);
      fetchMyReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const totalReviews = reviews.length;
  const average =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews;

  if (loading) {
    return (
      <div className="my-reviews-container">
        <div className="orders-loading">Loading your reviews...</div>
      </div>
    );
  }

  return (
    <div className="my-reviews-container">
      <div className="my-reviews-header">
        <div>
          <h1>My Reviews</h1>
          <p>
            Track and manage the reviews you have left for eco-friendly
            products.
          </p>
        </div>
        <div className="my-reviews-header-badge">
          {totalReviews} review{totalReviews !== 1 ? 's' : ''} written
        </div>
      </div>

      {error && <div className="order-error">{error}</div>}

      <div className="my-reviews-layout">
        <section className="my-reviews-list-card">
          <div className="my-reviews-list-header">
            <h2>Recent reviews</h2>
            <span>Most recent first</span>
          </div>

          {reviews.map((review) => {
            const productTitle = review.product?.title || 'Product';
            const reviewId = review._id;
            return (
              <div
                key={review._id}
                className="my-review-item my-review-item-clickable"
                role="button"
                tabIndex={0}
                onClick={() => handleReviewClick(review)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleReviewClick(review);
                }}
              >
                <div className="my-review-item-header">
                  <div className="my-review-product">{productTitle}</div>
                  <div className="my-review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <StarRating value={review.rating} readOnly />

                <p className="my-review-comment">{review.comment}</p>

                <div className="my-review-actions">
                  <span className="btn-link btn-link-edit">
                    View / Edit on product page →
                  </span>
                  <button
                    type="button"
                    className="btn-link btn-link-delete"
                    onClick={(e) => handleDeleteReview(e, reviewId)}
                    aria-label="Delete review"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {reviews.length === 0 && (
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              You have not written any reviews yet. Start by reviewing a product
              you have purchased from a delivered order.
            </p>
          )}
        </section>

        <aside className="my-reviews-sidebar-card">
          <h3>Review activity</h3>
          <p>
            Your reviews help other shoppers choose sustainable options and
            support responsible brands.
          </p>

          <div className="my-reviews-stat-row">
            <span className="my-reviews-stat-label">Total reviews</span>
            <span className="my-reviews-stat-value">{totalReviews}</span>
          </div>
          <div className="my-reviews-stat-row">
            <span className="my-reviews-stat-label">Average rating</span>
            <span className="my-reviews-stat-value">
              {average.toFixed(1)} / 5
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyReviewPage;