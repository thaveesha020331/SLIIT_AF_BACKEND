import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/Tudakshana/authService';
import reviewService from '../../services/Senara/reviewService';
import { authHelpers } from '../../services/Tudakshana/authService';
import ReviewList from '../../components/Senara/ReviewList';
import RatingSummaryBar from '../../components/Senara/RatingSummaryBar';
import '../../pages/Senara/ProductReviewPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
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

const AllUserProductReviews = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = authHelpers.getUser();

  useEffect(() => {
    if (!productId) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/${productId}`),
          reviewService.getProductReviews(productId),
        ]);
        setProduct(productRes.data?.data || productRes.data);
        setReviews(reviewsRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product reviews');
        setProduct(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  const { ownReviews, otherReviews } = useMemo(() => {
    if (!currentUser) return { ownReviews: [], otherReviews: reviews };
    const userId = String(currentUser._id || currentUser.id || '');
    const own = [];
    const others = [];

    reviews.forEach((r) => {
      const rUserId = r.userId ? String(r.userId) : '';
      if (rUserId && userId && rUserId === userId) {
        own.push(r);
      } else {
        others.push(r);
      }
    });

    return { ownReviews: own, otherReviews: others };
  }, [reviews, currentUser]);

  if (loading) {
    return (
      <div className="product-review-container">
        <div className="orders-loading">Loading reviews...</div>
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

  return (
    <div className="product-review-container">
      <div className="product-review-header">
        <div className="product-review-header-title">
          <h1>All product reviews</h1>
          <p>
            Read what every customer has shared about this product. Your own review,
            if you have written one, is highlighted below.
          </p>
        </div>
        <div className="product-review-header-cta">
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
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
              <span>{reviews.length} review(s)</span>
            </div>
            <RatingSummaryBar reviews={reviews} />
          </div>

          {currentUser && ownReviews.length > 0 && (
            <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4">
              <div className="mb-2 text-sm font-semibold text-emerald-800">
                Your review
              </div>
              <ReviewList reviews={ownReviews} />
            </div>
          )}

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              All reviews
            </h3>
            <ReviewList reviews={otherReviews} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllUserProductReviews;