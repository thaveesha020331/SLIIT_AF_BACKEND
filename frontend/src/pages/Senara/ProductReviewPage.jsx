import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/Tudakshana/authService';
import reviewService from '../../services/Senara/reviewService';
import { authHelpers } from '../../services/Tudakshana/authService';
import './ProductReviewPage.css';
import RatingSummaryBar from '../../components/Senara/RatingSummaryBar';
import ReviewList from '../../components/Senara/ReviewList';
import ReviewForm from '../../components/Senara/ReviewForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = API_URL.replace(/\/api\/?$/, '');

const getProductImageSrc = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400';

  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('blob:') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }

  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  return `${API_BASE_URL}/${imagePath}`;
};

const ProductReviewPage = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const currentUser = authHelpers.getUser();

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data?.data || res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Product not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load product');
      }
      setProduct(null);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getProductReviews(productId);
      setReviews(res.data?.data || []);
    } catch (err) {
      setReviews([]);
    }
  };

  const fetchCanReview = async () => {
    try {
      const res = await reviewService.checkCanReview(productId, orderId || undefined);
      setCanReview(res.data?.canReview === true);
    } catch (err) {
      setCanReview(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError('');
    Promise.all([fetchProduct(), fetchReviews(), fetchCanReview()]).finally(() =>
      setLoading(false)
    );
  }, [productId, orderId]);

  const refreshReviews = () => {
    fetchReviews();
    fetchCanReview();
  };

  const handleCreateReview = async (data) => {
    if (!canReview) return;
    setError('');
    setSubmitting(true);
    try {
      await reviewService.addReview({
        productId,
        orderId: orderId || undefined,
        rating: data.rating,
        title: data.title || '',
        comment: data.comment.trim(),
      });
      refreshReviews();
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (id, data) => {
    setError('');
    setSubmitting(true);
    try {
      const rating = Math.min(5, Math.max(1, Number(data.rating) || 1));
      if (data.comment.trim().length < 10) {
        setError('Comment must be at least 10 characters.');
        setSubmitting(false);
        return;
      }
      await reviewService.updateReview(id, {
        rating,
        title: (data.title || '').trim(),
        comment: data.comment.trim(),
      });
      refreshReviews();
      setEditingId(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update review';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setError('');
    try {
      await reviewService.deleteReview(id);
      refreshReviews();
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="product-review-container">
        <div className="orders-loading">Loading...</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-review-container">
        <div className="order-error">{error}</div>
      </div>
    );
  }

  const productData = product || {};
  const showReviewForm = canReview && currentUser;

  return (
    <div className="product-review-container">
      <div className="product-review-header">
        <div className="product-review-header-title">
          <h1>Product reviews</h1>
          <p>
            See what other eco-shoppers think about this product and share your
            own experience.
          </p>
        </div>
        <div className="product-review-header-cta">
          {showReviewForm ? (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                const formEl = document.querySelector('.product-review-right');
                if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Write a review
            </button>
          ) : !currentUser ? (
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              Log in to write a review
            </span>
          ) : (
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              {reviews.some((r) => r.userId && (currentUser?._id || currentUser?.id) && String(r.userId) === String(currentUser._id || currentUser.id))
                ? 'You have already reviewed this product'
                : 'You can only review products from delivered orders'}
            </span>
          )}
          <span style={{ fontSize: 12, color: '#065f46' }}>
            Honest feedback helps our green community.
          </span>
        </div>
      </div>

      {error && <div className="order-error">{error}</div>}

      <div className="product-review-layout">
        <aside className="product-overview-card">
          <div className="product-overview-image">
            <img
              src={getProductImageSrc(productData.image)}
              alt={productData.title}
            />
          </div>
          <div className="product-overview-body">
            <h2 className="product-overview-title">{productData.title || 'Product'}</h2>
            <div className="product-overview-meta">
              <span className="product-overview-badge badge-category">
                {productData.category || '—'}
              </span>
              <span className="product-overview-badge badge-cert">
                {productData.ecocertification || '—'}
              </span>
            </div>
            <div className="product-overview-price-row">
              <span className="product-overview-price">
                ${(productData.price ?? 0).toFixed(2)}
              </span>
              <span
                className={`product-overview-stock ${
                  (productData.stock ?? 0) > 0 ? 'in-stock' : 'out-of-stock'
                }`}
              >
                {(productData.stock ?? 0) > 0
                  ? `${productData.stock} in stock`
                  : 'Out of stock'}
              </span>
            </div>
            <p className="product-overview-description">
              {productData.description || '—'}
            </p>
          </div>
        </aside>

        <section className="product-review-right">
          <div className="reviews-section-card">
            <div className="reviews-section-header">
              <h2>Customer rating</h2>
              <span>{reviews.length} verified review(s)</span>
            </div>
            <RatingSummaryBar reviews={reviews} />
          </div>

          <ReviewList
            reviews={reviews}
            currentUserId={
              currentUser
                ? String(currentUser._id || currentUser.id || '')
                : undefined
            }
            editingId={editingId}
            onEdit={(id) => setEditingId(id)}
            onCancelEdit={() => setEditingId(null)}
            onUpdate={handleUpdateReview}
            onDelete={handleDeleteReview}
            submitting={submitting}
          />

          {showReviewForm && (
            <ReviewForm
              onSubmit={handleCreateReview}
              submitting={submitting}
              initialValues={null}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductReviewPage;