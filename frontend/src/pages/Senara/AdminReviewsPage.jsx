import React, { useState } from 'react';
import './AdminReviewsPage.css';
import StarRating from '../../components/Senara/StarRating';

// Dummy data for now – later you can replace with real API data
const dummyAdminReviews = [
  {
    id: 'a1',
    productTitle: 'Eco-Friendly Bamboo Water Bottle',
    userName: 'Tharindu',
    rating: 5,
    comment: 'Great bottle, very eco-friendly!',
    status: 'approved',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    productTitle: 'Organic Cotton T‑Shirt',
    userName: 'Sahan',
    rating: 4,
    comment: 'Comfortable but shipping was slow.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a3',
    productTitle: 'Biodegradable Phone Case',
    userName: 'Nimali',
    rating: 2,
    comment: 'Case cracked after one week.',
    status: 'rejected',
    createdAt: new Date().toISOString(),
  },
];

const AdminReviewsPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const handleApprove = (id) => {
    console.log('Approve review (UI only):', id);
    alert('Approve API can be wired here (demo only).');
  };

  const handleReject = (id) => {
    console.log('Reject review (UI only):', id);
    alert('Reject API can be wired here (demo only).');
  };

  const filtered = dummyAdminReviews.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.productTitle.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="admin-reviews-container">
      <div className="admin-reviews-header">
        <div>
          <h1>Reviews management</h1>
          <span>
            Review and moderate customer feedback across all products.
          </span>
        </div>
        <span>
          Total: {dummyAdminReviews.length} | Showing: {filtered.length}
        </span>
      </div>

      <div className="admin-reviews-filters">
        <div className="admin-reviews-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by product, user, or text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-reviews-filter-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="admin-reviews-table-wrapper">
        <table className="admin-reviews-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review) => (
              <tr key={review.id}>
                <td>{review.productTitle}</td>
                <td>{review.userName}</td>
                <td>
                  <StarRating value={review.rating} readOnly />
                </td>
                <td>{review.comment}</td>
                <td>
                  <span
                    className={`badge-status ${
                      review.status === 'pending'
                        ? 'badge-status-pending'
                        : review.status === 'approved'
                        ? 'badge-status-approved'
                        : 'badge-status-rejected'
                    }`}
                  >
                    {review.status}
                  </span>
                </td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-reviews-actions">
                    {review.status !== 'approved' && (
                      <button
                        type="button"
                        className="btn-small btn-approve"
                        onClick={() => handleApprove(review.id)}
                      >
                        Approve
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        type="button"
                        className="btn-small btn-reject"
                        onClick={() => handleReject(review.id)}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviewsPage;

