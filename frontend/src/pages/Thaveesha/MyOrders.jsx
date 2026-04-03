import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Loader2, ArrowRight, PackageOpen, CheckCircle2,
  Circle, XCircle, ShoppingBag, RotateCcw,
} from 'lucide-react';
import { orderAPI } from '../../services/Thaveesha';
import CancelConfirmModal from '../../components/Thaveesha/CancelConfirmModal';
import './Order.css';

const STATUS_LABELS = {
  pending:    'Pending',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-lime-100 text-lime-800',
  cancelled:  'bg-red-100 text-red-800',
};

const TRACKING_STEPS = ['Placed', 'Processing', 'Shipped', 'Delivered'];

function getStepIndex(status) {
  const map = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };
  return map[status] ?? 0;
}

function shortOrderId(id) {
  if (!id || typeof id !== 'string') return id;
  return id.length > 8 ? `…${id.slice(-8)}` : id;
}

function formatDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('en-LK', { dateStyle: 'medium' });
}

function itemsPreview(items) {
  if (!items?.length) return 'No items';
  return (
    items.slice(0, 2).map((i) => `${(i.product && i.product.title) || 'Item'} ×${i.quantity || 1}`).join(', ') +
    (items.length > 2 ? ` +${items.length - 2} more` : '')
  );
}

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setIsAuthenticated(false); setLoading(false); return; }
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const list = await orderAPI.getMyOrders();
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      if (err.response?.status === 401) { setIsAuthenticated(false); setLoading(false); return; }
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(orderId) {
    setCancellingId(orderId);
    try {
      await orderAPI.cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      setCancelModalOrderId(null);
    } catch (err) {
      if (err.response?.status === 401) setIsAuthenticated(false);
      else setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  }

  /* ── Loading ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 size={30} className="animate-spin text-lime-600" strokeWidth={2} />
        <p className="text-sm font-medium">Loading your orders…</p>
      </div>
    );
  }

  /* ── Not authenticated ────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center rounded-2xl border border-lime-200 bg-gradient-to-br from-white via-lime-50 to-lime-100 px-8 py-14 shadow-[0_8px_30px_rgba(132,204,22,0.1)]">
          <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D0D0D] text-lime-300 shadow-lg">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Login Required</h2>
          <p className="mt-2 text-sm text-gray-500">Please log in to view your orders.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0D0D0D] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-700"
          >
            Go to Login <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  /* ── Main render ──────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="px-4 md:px-6 lg:px-8 pt-4 pb-12 max-w-8xl mx-auto">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-lime-100 via-lime-200 to-lime-400 px-8 py-12">
          <div className="pointer-events-none absolute top-0 right-0 w-2/3 h-full bg-white/10 rounded-l-full blur-3xl transform translate-x-1/4" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-1/2 h-1/2 bg-lime-300/20 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-lime-800 backdrop-blur-sm">
                <Leaf size={13} className="text-lime-700" />
                Eco.Mart
              </span>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">My Orders</h1>
              <p className="mt-1 text-sm text-gray-700">
                {orders.length > 0
                  ? `${orders.length} order${orders.length !== 1 ? 's' : ''} in your history`
                  : 'Track and manage your purchases'}
              </p>
            </div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-[#0D0D0D] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-700"
            >
              <ShoppingBag size={14} /> View cart
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 pt-6 pb-16 max-w-7xl mx-auto">

        {/* ── Error banner ──────────────────────────── */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span className="font-bold">!</span>
            {error}
            <button
              type="button"
              onClick={() => { setError(null); fetchOrders(); }}
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800"
            >
              <RotateCcw size={12} /> Try again
            </button>
          </div>
        )}

        {/* ── Empty state ───────────────────────────── */}
        {orders.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-lime-200 bg-gradient-to-br from-white via-lime-50 to-lime-100 px-8 py-14 text-center shadow-[0_8px_30px_rgba(132,204,22,0.1)]">
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D0D0D] text-lime-300 shadow-lg">
              <PackageOpen size={30} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-500">Browse our eco-friendly products and place your first order.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0D0D0D] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-700"
            >
              Browse products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => {
              const stepIndex = getStepIndex(order.status);
              const canCancel = ['pending', 'processing'].includes(order.status);
              const isCancelled = order.status === 'cancelled';
              const busy = cancellingId === order._id;

              return (
                <article
                  key={order._id}
                  className="rounded-2xl border border-lime-200/80 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] overflow-hidden transition-shadow hover:shadow-[0_8px_30px_rgba(132,204,22,0.12)]"
                >
                  {/* Card header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-lime-100 bg-lime-50/40">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/my-orders/${order._id}`}
                        className="font-mono text-sm font-bold text-gray-900 hover:text-lime-700 transition-colors"
                        title={order._id}
                      >
                        {shortOrderId(order._id)}
                      </Link>
                      <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                      <span className="text-base font-bold text-lime-700">${(order.total ?? 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    {/* Items preview + shipping */}
                    <p className="text-sm text-gray-600 mb-1">{itemsPreview(order.items)}</p>
                    {order.shippingAddress && (
                      <p className="text-xs text-gray-400 mb-4">Ship to: {order.shippingAddress}</p>
                    )}

                    {/* Tracking stepper */}
                    {!isCancelled ? (
                      <div className="mb-5">
                        <div className="flex items-center gap-0">
                          {TRACKING_STEPS.map((label, i) => {
                            const done = i < stepIndex;
                            const current = i === stepIndex;
                            return (
                              <React.Fragment key={label}>
                                <div className="flex flex-col items-center gap-1">
                                  {done ? (
                                    <CheckCircle2 size={22} className="text-lime-500" strokeWidth={2} />
                                  ) : current ? (
                                    <div className="h-[22px] w-[22px] rounded-full border-2 border-lime-500 bg-lime-100 flex items-center justify-center">
                                      <div className="h-2.5 w-2.5 rounded-full bg-lime-500 animate-pulse" />
                                    </div>
                                  ) : (
                                    <Circle size={22} className="text-gray-200" strokeWidth={1.5} />
                                  )}
                                  <span className={`text-[10px] font-semibold ${done || current ? 'text-gray-700' : 'text-gray-300'}`}>
                                    {label}
                                  </span>
                                </div>
                                {i < TRACKING_STEPS.length - 1 && (
                                  <div className={`flex-1 h-0.5 mb-4 mx-1 ${done ? 'bg-lime-400' : 'bg-gray-100'}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 font-medium">
                        <XCircle size={14} /> Order cancelled
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/my-orders/${order._id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0D0D0D] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-700"
                      >
                        View details <ArrowRight size={12} />
                      </Link>
                      {order.status === 'delivered' && order.items?.length > 0 && (
                        <Link
                          to={`/products/${order.items[0].product?._id || order.items[0].product}/review?orderId=${order._id}`}
                          className="inline-flex items-center gap-1.5 rounded-full border-2 border-lime-400 bg-lime-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-lime-800 transition-colors hover:bg-lime-100"
                        >
                          Add review
                        </Link>
                      )}
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => setCancelModalOrderId(order._id)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-full border-2 border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {busy ? <><Loader2 size={12} className="animate-spin" /> Cancelling…</> : <><XCircle size={12} /> Cancel</>}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <CancelConfirmModal
        open={!!cancelModalOrderId}
        title="Cancel order?"
        message="This action cannot be undone. Your payment will not be charged if applicable."
        onConfirm={() => cancelModalOrderId && handleCancel(cancelModalOrderId)}
        onCancel={() => { if (!cancellingId) setCancelModalOrderId(null); }}
        loading={cancellingId === cancelModalOrderId}
      />
    </div>
  );
}
