import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/Thaveesha';
import CancelConfirmModal from '../../components/Thaveesha/CancelConfirmModal';
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

function shortOrderId(id) {
  if (!id || typeof id !== 'string') return id;
  return id.length > 8 ? `...${id.slice(-8)}` : id;
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const list = await orderAPI.getMyOrders();
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function openCancelModal(orderId) {
    setCancelModalOrderId(orderId);
  }

  function closeCancelModal() {
    if (!cancellingId) setCancelModalOrderId(null);
  }

  async function handleCancel(orderId) {
    setCancellingId(orderId);
    try {
      await orderAPI.cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: 'cancelled' } : o
        )
      );
      setCancelModalOrderId(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.message || 'Failed to cancel order');
      }
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

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="order-page-container">
        <div className="orders-loading">Loading orders...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="order-page-container">
        <div className="orders-empty">
          <div className="empty-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please log in to view your orders</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page-container">
      <div className="order-page-header">
        <h1>My Orders</h1>
        <p>Order history & tracking – Order & Cart (Thaveesha)</p>
      </div>

      {error && (
        <div className="order-error">
          {error}
          <button type="button" className="btn-try-again" onClick={() => { setError(null); fetchOrders(); }}>
            Try again
          </button>
        </div>
      )}

      <CancelConfirmModal
        open={!!cancelModalOrderId}
        title="Cancel order?"
        message="This action cannot be undone. Your payment will not be charged if applicable."
        onConfirm={() => cancelModalOrderId && handleCancel(cancelModalOrderId)}
        onCancel={closeCancelModal}
        loading={cancellingId === cancelModalOrderId}
      />

      {orders.length === 0 ? (
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
                    <Link to={`/my-orders/${order._id}`} className="order-detail-link" title={order._id}>
                      {shortOrderId(order._id)}
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
                  {order.status === 'delivered' && order.items?.length > 0 && (
                    <Link
                      to={`/products/${order.items[0].product?._id || order.items[0].product}/review?orderId=${order._id}`}
                      className="btn-primary-link btn-small"
                    >
                      Add review
                    </Link>
                  )}
                  {canCancel && (
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => openCancelModal(order._id)}
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
