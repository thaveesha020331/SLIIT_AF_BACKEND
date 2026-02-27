import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/Thaveesha';
import OrderTrackingMap from '../../components/Thaveesha/OrderTrackingMap';
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

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      setError(err.response?.data?.message || 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  function openCancelModal() {
    setCancelModalOpen(true);
  }

  async function handleCancel() {
    if (!order || !['pending', 'processing'].includes(order.status)) return;
    setCancelling(true);
    try {
      const data = await orderAPI.cancelOrder(orderId);
      setOrder(data.order);
      setCancelModalOpen(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.message || 'Failed to cancel order');
      }
    } finally {
      setCancelling(false);
    }
  }

  function formatDate(iso) {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('en-LK', { dateStyle: 'medium' });
  }

  if (loading) {
    return (
      <div className="order-page-container">
        <div className="orders-loading">Loading order...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="order-page-container">
        <div className="orders-empty">
          <div className="empty-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please log in to view order details</p>
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

  if (error && !order) {
    return (
      <div className="order-page-container">
        <div className="order-error">
          {error}
          <button type="button" className="btn-try-again" onClick={() => { setError(null); fetchOrder(); }}>
            Try again
          </button>
        </div>
        <p style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/my-orders" className="btn-primary-link">Back to My Orders</Link>
        </p>
      </div>
    );
  }

  const stepIndex = getStepIndex(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status);

  return (
    <div className="order-page-container">
      <div className="order-page-header">
        <h1>Order {order._id}</h1>
        <p>{formatDate(order.createdAt)} – Order & Cart (Thaveesha)</p>
      </div>

      {error && <div className="order-error">{error}</div>}

      <div className="order-detail-card">
        <div className="order-card-header">
          <span className="order-id">{order._id}</span>
          <span className="order-date">{formatDate(order.createdAt)}</span>
          <span className={`order-status ${order.status}`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>

        <div className="order-total">Total: ${(order.total ?? 0).toFixed(2)}</div>

        {order.shippingAddress && (
          <div className="order-items-preview">Ship to: {order.shippingAddress}</div>
        )}
        {order.phone && (
          <div className="order-items-preview">Phone: {order.phone}</div>
        )}
        {order.notes && (
          <div className="order-items-preview">Notes: {order.notes}</div>
        )}

        <div className="order-detail-items">
          <h4>Items</h4>
          {(order.items || []).map((line) => {
            const product = line.product || {};
            const price = line.priceSnapshot ?? product.price ?? 0;
            const qty = line.quantity ?? 1;
            return (
              <div key={line._id || product._id} className="cart-item">
                <img
                  className="cart-item-image"
                  src={product.image || 'https://via.placeholder.com/80'}
                  alt={product.title}
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{product.title || 'Product'}</h3>
                  <span className="cart-item-price">${price.toFixed(2)} × {qty}</span>
                  {order.status === 'delivered' && (
                    <Link
                      to={`/products/${product._id || product}/review?orderId=${orderId}`}
                      className="btn-outline btn-small"
                      style={{ marginTop: 8, display: 'inline-block' }}
                    >
                      Add review
                    </Link>
                  )}
                </div>
                <span className="cart-item-price">${(price * qty).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

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

          <OrderTrackingMap
          shippingAddress={order.shippingAddress}
          shippingLat={order.shippingLat}
          shippingLng={order.shippingLng}
          trackingLat={order.trackingLat}
          trackingLng={order.trackingLng}
        />

        {canCancel && (
          <button
            type="button"
            className="cart-item-remove"
            style={{ marginTop: 16 }}
            onClick={openCancelModal}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel order'}
          </button>
        )}
      </div>

      <CancelConfirmModal
        open={cancelModalOpen}
        title="Cancel order?"
        message="This action cannot be undone."
        onConfirm={handleCancel}
        onCancel={() => !cancelling && setCancelModalOpen(false)}
        loading={cancelling}
      />

      <p style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/my-orders" className="btn-primary-link">Back to My Orders</Link>
        {' · '}
        <Link to="/products" className="btn-primary-link">Continue shopping</Link>
      </p>
    </div>
  );
}
