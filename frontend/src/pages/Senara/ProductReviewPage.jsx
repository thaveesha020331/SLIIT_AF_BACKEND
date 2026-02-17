import React from 'react';
import './ProductReviewPage.css';
import RatingSummaryBar from '../../components/Senara/RatingSummaryBar';
import ReviewList from '../../components/Senara/ReviewList';
import ReviewForm from '../../components/Senara/ReviewForm';

// Temporary dummy data to show the layout like an e‑commerce site
const dummyProduct = {
  id: 'p1',
  title: 'Eco-Friendly Bamboo Water Bottle',
  description:
    'Sustainable bamboo water bottle made from 100% natural materials. Lightweight, durable and perfect for reducing single‑use plastic.',
  category: 'Reusable',
  ecocertification: 'Carbon Neutral',
  price: 29.99,
  stock: 42,
  image:
    'https://images.unsplash.com/photo-1602143407151-7111542de099?w=800&h=600&fit=crop',
};

const dummyReviews = [
  {
    id: 'r1',
    authorName: 'Tharindu',
    title: 'Perfect for daily use',
    comment:
      'I use this bottle every day. It keeps my water fresh and I feel better about avoiding plastic.',
    rating: 5,
    createdAt: new Date().toISOString(),
    ecoTags: ['Plastic-free', 'Reusable'],
  },
  {
    id: 'r2',
    authorName: 'Sahan',
    title: 'Good but a bit heavy',
    comment:
      'Quality is amazing and very eco-friendly, but it is slightly heavier than a normal bottle.',
    rating: 4,
    createdAt: new Date().toISOString(),
    ecoTags: ['Durable'],
  },
];

const ProductReviewPage = () => {
  const handleCreateReview = (data) => {
    // Later you can replace this with an API call
    // axios.post(`/api/products/${productId}/reviews`, data)
    console.log('Submit review (UI only):', data);
    alert('Review submitted (demo only). Wire this up to your API.');
  };

  return (
    <div className="product-review-container">
      <div className="product-review-header">
        <div className="product-review-header-title">
          <h1>Product reviews</h1>
          <p>
            See what other eco‑shoppers think about this product and share your
            own experience.
          </p>
        </div>
        <div className="product-review-header-cta">
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
          >
            Write a review
          </button>
          <span style={{ fontSize: 12, color: '#065f46' }}>
            Honest feedback helps our green community.
          </span>
        </div>
      </div>

      <div className="product-review-layout">
        {/* Left: compact product overview */}
        <aside className="product-overview-card">
          <div className="product-overview-image">
            <img src={dummyProduct.image} alt={dummyProduct.title} />
          </div>
          <div className="product-overview-body">
            <h2 className="product-overview-title">{dummyProduct.title}</h2>

            <div className="product-overview-meta">
              <span className="product-overview-badge badge-category">
                {dummyProduct.category}
              </span>
              <span className="product-overview-badge badge-cert">
                {dummyProduct.ecocertification}
              </span>
            </div>

            <div className="product-overview-price-row">
              <span className="product-overview-price">
                ${dummyProduct.price.toFixed(2)}
              </span>
              <span
                className={`product-overview-stock ${
                  dummyProduct.stock > 0 ? 'in-stock' : 'out-of-stock'
                }`}
              >
                {dummyProduct.stock > 0
                  ? `${dummyProduct.stock} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            <p className="product-overview-description">
              {dummyProduct.description}
            </p>
          </div>
        </aside>

        {/* Right: rating summary + reviews + form */}
        <section className="product-review-right">
          <div className="reviews-section-card">
            <div className="reviews-section-header">
              <h2>Customer rating</h2>
              <span>{dummyReviews.length} verified review(s)</span>
            </div>
            <RatingSummaryBar reviews={dummyReviews} />
          </div>

          <ReviewList reviews={dummyReviews} />

          <ReviewForm onSubmit={handleCreateReview} />
        </section>
      </div>
    </div>
  );
};

export default ProductReviewPage;

