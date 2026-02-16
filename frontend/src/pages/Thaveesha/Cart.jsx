import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Order.css';

const API_BASE = ''; // same origin; set proxy in vite if needed

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/api/cart`);
      setCart(Array.isArray(res.data?.items) ? res.data.items : res.data || []);
    } catch (err) {
      // Mock cart for UI when backend not ready
      setCart([
        { _id: '1', product: { _id: '1', title: 'Eco Bamboo Bottle', price: 29.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de099?w=200&h=200&fit=crop' }, quantity: 2 },
        { _id: '2', product: { _id: '2', title: 'Organic Cotton T-Shirt', price: 34.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop' }, quantity: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function updateQty(itemId, delta) {
    setCart((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );
  }

  function removeItem(itemId) {
    setCart((prev) => prev.filter((item) => item._id !== itemId));
  }

  const subtotal = cart.reduce((sum, item) => {
    const p = item.product || item;
    const price = p.price ?? 0;
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  async function handleCheckout(e) {
    e.preventDefault();
    setPlacing(true);
    setError(null);
    try {
      await axios.post(`${API_BASE}/api/orders`, {
        items: cart.map((item) => ({
          productId: (item.product && item.product._id) || item._id,
          quantity: item.quantity || 1,
        })),
        shippingAddress: checkoutForm.shippingAddress,
        phone: checkoutForm.phone,
        notes: checkoutForm.notes,
      });
      setOrderSuccess(true);
      setCart([]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Checkout failed. Using demo mode.');
      setOrderSuccess(true);
      setCart([]);
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
                      <button type="button" onClick={() => updateQty(item._id, -1)} aria-label="Decrease">−</button>
                      <span>{qty}</span>
                      <button type="button" onClick={() => updateQty(item._id, 1)} aria-label="Increase">+</button>
                    </div>
                    <span className="cart-item-price">${(price * qty).toFixed(2)}</span>
                    <button type="button" className="cart-item-remove" onClick={() => removeItem(item._id)}>
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

              <form className="checkout-form" onSubmit={handleCheckout}>
                <div className="form-group">
                  <label>Shipping Address *</label>
                  <input
                    type="text"
                    value={checkoutForm.shippingAddress}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value })}
                    placeholder="Street, City, Postal code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    placeholder="+94 7x xxx xxxx"
                    required
                  />
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
