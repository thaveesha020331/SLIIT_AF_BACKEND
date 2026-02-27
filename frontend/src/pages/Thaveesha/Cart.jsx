import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../../services/Thaveesha';
import { authAPI } from '../../services/Tudakshana/authService';
import MapAddressPicker from '../../components/Thaveesha/MapAddressPicker';
import './Order.css';

function formatProfileAddress(addr) {
  if (!addr || typeof addr !== 'object') return '';
  const parts = [addr.street, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean);
  return parts.join(', ');
}

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [shippingLat, setShippingLat] = useState(null);
  const [shippingLng, setShippingLng] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: '',
    phone: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!cart.length) return;
    authAPI.getProfile().then((res) => {
      const user = res?.data?.user;
      if (!user) return;
      setCheckoutForm((prev) => ({
        ...prev,
        ...(user.phone && { phone: user.phone }),
        ...(user.address && { shippingAddress: formatProfileAddress(user.address) || prev.shippingAddress }),
      }));
    }).catch(() => {});
  }, [cart.length]);

  async function fetchCart() {
    setLoading(true);
    setError(null);
    try {
      const { items } = await cartAPI.getCart();
      setCart(Array.isArray(items) ? items : []);
    } catch (err) {
      if (err.response?.status === 401) return;
      setError(err.response?.data?.message || err.message || 'Failed to load cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(itemId, delta) {
    const item = cart.find((i) => i._id === itemId);
    if (!item) return;
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    if (newQty === item.quantity) return;
    setError(null);
    setUpdating(itemId);
    try {
      const data = await cartAPI.updateItem(itemId, newQty);
      if (data?.items) setCart(data.items);
    } catch (err) {
      if (err.response?.status === 401) return;
      setError(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(itemId) {
    setError(null);
    setUpdating(itemId);
    try {
      const data = await cartAPI.removeItem(itemId);
      if (data?.items) setCart(data.items);
    } catch (err) {
      if (err.response?.status === 401) return;
      setError(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setUpdating(null);
    }
  }

  const subtotal = cart.reduce((sum, item) => {
    const p = item.product || item;
    const price = p.price ?? 0;
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  function validateCheckout() {
    const errs = {};
    const addr = (checkoutForm.shippingAddress || '').trim();
    const phone = (checkoutForm.phone || '').trim();
    if (addr.length < 10) errs.shippingAddress = 'Please enter a full address (at least 10 characters).';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) errs.phone = 'Please enter a valid phone number (at least 9 digits).';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (!validateCheckout()) return;
    setPlacing(true);
    setError(null);
    setFieldErrors({});
    try {
      const response = await orderAPI.createOrder({
        items: cart.map((item) => ({
          productId: (item.product && item.product._id) || item._id,
          quantity: item.quantity || 1,
        })),
        shippingAddress: checkoutForm.shippingAddress.trim(),
        phone: checkoutForm.phone.trim(),
        notes: checkoutForm.notes.trim(),
        ...(shippingLat != null && shippingLng != null && { shippingLat, shippingLng }),
      });

      // Get order ID from response
      const orderId = response.order?._id || response._id;
      
      if (orderId) {
        setOrderSuccess(true);
        setCart([]);
        // Redirect to checkout page after 1 second
        setTimeout(() => {
          navigate(`/checkout/${orderId}`);
        }, 1000);
      } else {
        setError('Order created but ID not found. Please try again.');
        setOrderSuccess(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Checkout failed.');
      if (err.response?.status !== 401) {
        setOrderSuccess(false);
      }
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div className="order-page-container">
        <div className="order-page-header">
          <h1>Your Cart</h1>
          <p>Eco.Mart – Order & Cart (Thaveesha)</p>
        </div>
        <div className="orders-loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="order-page-container">
      <div className="order-page-header">
        <h1>Your Cart</h1>
        <p>Review items and checkout – Order & Cart (Thaveesha)</p>
      </div>

      {orderSuccess && (
        <div className="success-message">
          Order placed successfully. View <Link to="/my-orders">My Orders</Link> to track.
        </div>
      )}

      {error && <div className="order-error">{error}</div>}

      {cart.length === 0 && !orderSuccess ? (
        <div className="cart-list">
          <div className="cart-empty">
            Your cart is empty. <Link to="/products">Browse products</Link> to add items.
          </div>
        </div>
      ) : (
        !orderSuccess && (
          <div className="cart-layout">
            <div className="cart-list">
              {cart.map((item) => {
                const p = item.product || item;
                const price = p.price ?? 0;
                const qty = item.quantity ?? 1;
                const busy = updating === item._id;
                return (
                  <div key={item._id} className="cart-item">
                    <img
                      className="cart-item-image"
                      src={p.image || 'https://via.placeholder.com/80'}
                      alt={p.title}
                    />
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{p.title}</h3>
                      <span className="cart-item-price">${price.toFixed(2)} each</span>
                    </div>
                    <div className="cart-item-qty">
                      <button
                        type="button"
                        onClick={() => updateQty(item._id, -1)}
                        aria-label="Decrease"
                        disabled={busy || qty <= 1}
                      >
                        −
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item._id, 1)}
                        aria-label="Increase"
                        disabled={busy}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">${(price * qty).toFixed(2)}</span>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeItem(item._id)}
                      disabled={busy}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="checkout-summary">
              <h2>Checkout</h2>
              <div className="checkout-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-row">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="checkout-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {showMapPicker && (
                <MapAddressPicker
                  onSelect={({ address, lat, lng }) => {
                    setCheckoutForm((f) => ({ ...f, shippingAddress: address }));
                    setShippingLat(lat);
                    setShippingLng(lng);
                    setShowMapPicker(false);
                  }}
                  onClose={() => setShowMapPicker(false)}
                />
              )}
              <form className="checkout-form" onSubmit={handleCheckout}>
                <div className="form-group">
                  <label>Shipping Address *</label>
                  <input
                    type="text"
                    value={checkoutForm.shippingAddress}
                    onChange={(e) => { setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value }); setFieldErrors((f) => ({ ...f, shippingAddress: undefined })); }}
                    placeholder="Street, City, Postal code"
                    required
                    className={fieldErrors.shippingAddress ? 'input-error' : ''}
                  />
                  {fieldErrors.shippingAddress && <span className="field-error">{fieldErrors.shippingAddress}</span>}
                  <button
                    type="button"
                    className="btn-map-pick"
                    onClick={() => setShowMapPicker(true)}
                  >
                    Set location on map
                  </button>
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => { setCheckoutForm({ ...checkoutForm, phone: e.target.value }); setFieldErrors((f) => ({ ...f, phone: undefined })); }}
                    placeholder="+94 7x xxx xxxx"
                    required
                    className={fieldErrors.phone ? 'input-error' : ''}
                  />
                  {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={checkoutForm.notes}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                    placeholder="Delivery instructions (optional)"
                    rows="2"
                  />
                </div>
                <button type="submit" className="btn-checkout" disabled={placing}>
                  {placing ? 'Placing order...' : 'Place order'}
                </button>
              </form>
            </div>
          </div>
        )
      )}

      {orderSuccess && (
        <p className="orders-empty">
          <Link to="/products" className="btn-primary-link">Continue shopping</Link>
        </p>
      )}
    </div>
  );
}
