import React from 'react';
import './MyReviewPage.css';
import StarRating from '../../components/Senara/StarRating';

// Dummy data for now – later you can replace with API data
const myDummyReviews = [
  {
    id: 'm1',
    productTitle: 'Eco-Friendly Bamboo Water Bottle',
    rating: 5,
    comment: 'Love this bottle! I stopped buying plastic water bottles.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm2',
    productTitle: 'Organic Cotton T‑Shirt',
    rating: 4,
    comment: 'Very comfortable and soft, sizing is a bit larger than expected.',
    createdAt: new Date().toISOString(),
  },
];

const MyReviewPage = () => {
  const handleEdit = (reviewId) => {
    console.log('Edit review (UI only):', reviewId);
    alert('Edit review UI can open a modal or redirect (demo only).');
  };

  const handleDelete = (reviewId) => {
    console.log('Delete review (UI only):', reviewId);
    alert('Delete review can call an API (demo only).');
  };

  const totalReviews = myDummyReviews.length;
  const average =
    totalReviews === 0
      ? 0
      : myDummyReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  return (
    <div className="my-reviews-container">
      <div className="my-reviews-header">
        <div>
          <h1>My Reviews</h1>
          <p>
            Track and manage the reviews you have left for eco‑friendly
            products.
          </p>
        </div>
        <div className="my-reviews-header-badge">
          {totalReviews} review{totalReviews !== 1 ? 's' : ''} written
        </div>
      </div>

      <div className="my-reviews-layout">
        <section className="my-reviews-list-card">
          <div className="my-reviews-list-header">
            <h2>Recent reviews</h2>
            <span>Most recent first</span>
          </div>

          {myDummyReviews.map((review) => (
            <div key={review.id} className="my-review-item">
              <div className="my-review-item-header">
                <div className="my-review-product">{review.productTitle}</div>
                <div className="my-review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>

              <StarRating value={review.rating} readOnly />

              <p className="my-review-comment">{review.comment}</p>

              <div className="my-review-actions">
                <button
                  type="button"
                  className="btn-link btn-link-edit"
                  onClick={() => handleEdit(review.id)}
                >
                  Edit review
                </button>
                <button
                  type="button"
                  className="btn-link btn-link-delete"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {myDummyReviews.length === 0 && (
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              You have not written any reviews yet. Start by reviewing a
              product you have purchased.
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

