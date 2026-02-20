import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Tudakshana/authService';
import './Order.css';

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const TRACKING_STEPS = ['Order placed', 'Processing', 'Shipped', 'Delivered'];

function getStepIndex(status) {
  const map = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };
  return map[status] ?? 0;
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(Array.isArray(res.data) ? res.data : res.data?.orders || []);
    } catch (err) {
      if (err.response?.status === 401) return;
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(orderId) {
    if (!window.confirm('Cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: 'cancelled' } : o
        )
      );
    } catch (err) {
      if (err.response?.status === 401) return;
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  }

  function formatDate(iso) {
    if (!iso) return '–';
    const d = new Date(iso);
    return d.toLocaleDateString('en-LK', { dateStyle: 'medium' });
  }

  function itemsPreview(items) {
    if (!items || !items.length) return 'No items';
    return items
      .slice(0, 3)
      .map((i) => `${(i.product && i.product.title) || 'Item'} × ${i.quantity || 1}`)
      .join(', ') + (items.length > 3 ? '...' : '');
  }

  return (
    <div className="order-page-container">
      <div className="order-page-header">
        <h1>My Orders</h1>
        <p>Order history & tracking – Order & Cart (Thaveesha)</p>
      </div>

      {error && <div className="order-error">{error}</div>}

      {loading ? (
        <div className="orders-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          You have no orders yet. <Link to="/products" className="btn-primary-link">Browse products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const stepIndex = getStepIndex(order.status);
            const canCancel = ['pending', 'processing'].includes(order.status);
            const busy = cancellingId === order._id;
            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">
                    <Link to={`/my-orders/${order._id}`} className="order-detail-link">
                      {order._id}
                    </Link>
                  </span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                  <span className={`order-status ${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="order-total">Total: ${(order.total ?? 0).toFixed(2)}</div>
                <div className="order-items-preview">{itemsPreview(order.items)}</div>
                {order.shippingAddress && (
                  <div className="order-items-preview">Ship to: {order.shippingAddress}</div>
                )}

                <div className="order-tracking">
                  <h4>Order tracking</h4>
                  <div className="tracking-steps">
                    {TRACKING_STEPS.map((label, i) => {
                      const done = order.status === 'cancelled' ? false : i <= stepIndex;
                      const current = i === stepIndex && order.status !== 'cancelled';
                      return (
                        <span
                          key={label}
                          className={`tracking-step ${done ? 'done' : current ? 'current' : 'pending'}`}
                        >
                          {done ? '✓ ' : ''}{label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="order-card-actions">
                  <Link to={`/my-orders/${order._id}`} className="btn-primary-link btn-small">
                    View details
                  </Link>
                  {canCancel && (
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => handleCancel(order._id)}
                      disabled={busy}
                    >
                      {busy ? 'Cancelling...' : 'Cancel order'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/cart" className="btn-primary-link">View cart</Link>
      </p>
    </div>
  );
}
