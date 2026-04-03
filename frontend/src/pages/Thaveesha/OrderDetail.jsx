import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Leaf, Loader2, ArrowLeft, ArrowRight, MapPin, Phone, FileText,
  Package, CheckCircle2, Circle, XCircle, Star,
} from 'lucide-react';
import { orderAPI } from '../../services/Thaveesha';
import OrderTrackingMap from '../../components/Thaveesha/OrderTrackingMap';
import CancelConfirmModal from '../../components/Thaveesha/CancelConfirmModal';
import './Order.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

function getImageSrc(path) {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
}

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-lime-100 text-lime-800',
  cancelled:  'bg-red-100 text-red-800',
};

const TRACKING_STEPS = ['Order placed', 'Processing', 'Shipped', 'Delivered'];

function getStepIndex(status) {
  const map = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };
  return map[status] ?? 0;
}

function formatDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('en-LK', { dateStyle: 'medium' });
}

function shortId(id) {
  if (!id || typeof id !== 'string') return id;
  return id.length > 8 ? `…${id.slice(-8)}` : id;
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
    const token = localStorage.getItem('token');
    if (!token) { setIsAuthenticated(false); setLoading(false); return; }
    fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      if (err.response?.status === 401) { setIsAuthenticated(false); setLoading(false); return; }
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!order || !['pending', 'processing'].includes(order.status)) return;
    setCancelling(true);
    try {
      const data = await orderAPI.cancelOrder(orderId);
      setOrder(data.order);
      setCancelModalOpen(false);
    } catch (err) {
      if (err.response?.status === 401) setIsAuthenticated(false);
      else setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  }

  /* ── Loading ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 size={30} className="animate-spin text-lime-600" strokeWidth={2} />
        <p className="text-sm font-medium">Loading order…</p>
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
          <p className="mt-2 text-sm text-gray-500">Please log in to view order details.</p>
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

  /* ── Error (no order) ─────────────────────────────── */
  if (error && !order) {
    return (
      <div className="min-h-screen bg-white px-4 md:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 mb-6">
          <span className="font-bold">!</span> {error}
          <button
            type="button"
            onClick={() => { setError(null); fetchOrder(); }}
            className="ml-auto text-xs font-bold underline"
          >
            Try again
          </button>
        </div>
        <div className="text-center">
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 rounded-full bg-[#0D0D0D] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-gray-700"
          >
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const stepIndex = getStepIndex(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status);
  const isCancelled = order.status === 'cancelled';

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
                Order Details
              </span>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Order Summary</h1>
              <p className="mt-1 text-sm text-gray-700 font-mono">{shortId(order._id)}</p>
              <p className="mt-0.5 text-sm text-gray-600">{formatDate(order.createdAt)}</p>
            </div>
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-[#0D0D0D] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-700"
            >
              <ArrowLeft size={14} /> My Orders
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 pt-6 pb-16 max-w-7xl mx-auto">

        {/* ── Error banner ─────────────────────────── */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span className="font-bold">!</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ── Left column ──────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Status + summary card */}
            <div className="rounded-2xl border border-lime-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-lime-100 bg-lime-50/40">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="text-2xl font-bold text-lime-700">${(order.total ?? 0).toFixed(2)}</span>
              </div>

              <div className="divide-y divide-lime-50">
                {order.shippingAddress && (
                  <div className="flex items-start gap-3 px-6 py-4 text-sm text-gray-700">
                    <MapPin size={16} className="text-lime-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Ship to</p>
                      {order.shippingAddress}
                    </div>
                  </div>
                )}
                {order.phone && (
                  <div className="flex items-center gap-3 px-6 py-4 text-sm text-gray-700">
                    <Phone size={16} className="text-lime-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Phone</p>
                      {order.phone}
                    </div>
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-start gap-3 px-6 py-4 text-sm text-gray-700">
                    <FileText size={16} className="text-lime-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Notes</p>
                      {order.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-lime-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-lime-100">
                <Package size={18} className="text-lime-600" />
                <h2 className="text-base font-bold text-gray-900">
                  Items
                  <span className="ml-2 rounded-full bg-lime-100 px-2.5 py-0.5 text-xs font-bold text-lime-800">
                    {order.items?.length ?? 0}
                  </span>
                </h2>
              </div>
              <ul className="divide-y divide-lime-50">
                {(order.items || []).map((line) => {
                  const product = line.product || {};
                  const price = line.priceSnapshot ?? product.price ?? 0;
                  const qty = line.quantity ?? 1;
                  const imgSrc = getImageSrc(product.image);
                  return (
                    <li key={line._id || product._id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5">
                      {/* image */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-lime-100 bg-lime-50">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={product.title}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-lime-300">
                            <Package size={28} strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">{product.title || 'Product'}</p>
                        <p className="mt-1 text-xs text-gray-500">${price.toFixed(2)} × {qty}</p>
                        {order.status === 'delivered' && (
                          <Link
                            to={`/products/${product._id || product}/review?orderId=${orderId}`}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-lime-700 hover:text-lime-900 transition-colors"
                          >
                            <Star size={12} /> Add review
                          </Link>
                        )}
                      </div>
                      {/* line total */}
                      <p className="text-sm font-bold text-lime-700 shrink-0">${(price * qty).toFixed(2)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Tracking Map */}
            <div className="rounded-2xl border border-lime-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] overflow-hidden">
              <OrderTrackingMap
                shippingAddress={order.shippingAddress}
                shippingLat={order.shippingLat}
                shippingLng={order.shippingLng}
                trackingLat={order.trackingLat}
                trackingLng={order.trackingLng}
              />
            </div>
          </div>

          {/* ── Right column ─────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Tracking stepper */}
            <div className="rounded-2xl border border-lime-200/80 bg-gradient-to-b from-white to-lime-50 shadow-[0_10px_35px_rgba(132,204,22,0.1)] px-6 py-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Order tracking</h2>

              {isCancelled ? (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <XCircle size={18} className="text-red-400 shrink-0" />
                  This order has been cancelled.
                </div>
              ) : (
                <ol className="relative flex flex-col gap-0">
                  {TRACKING_STEPS.map((label, i) => {
                    const done = i < stepIndex;
                    const current = i === stepIndex;
                    const future = i > stepIndex;
                    return (
                      <li key={label} className="flex items-start gap-4 pb-6 last:pb-0 relative">
                        {/* connector line */}
                        {i < TRACKING_STEPS.length - 1 && (
                          <div className={`absolute left-[15px] top-8 w-0.5 h-full -translate-x-1/2 ${done ? 'bg-lime-400' : 'bg-gray-200'}`} />
                        )}
                        {/* dot */}
                        <div className="relative z-10 shrink-0">
                          {done ? (
                            <CheckCircle2 size={30} className="text-lime-500" strokeWidth={2} />
                          ) : current ? (
                            <div className="h-[30px] w-[30px] rounded-full border-2 border-lime-500 bg-lime-100 flex items-center justify-center">
                              <div className="h-3 w-3 rounded-full bg-lime-500 animate-pulse" />
                            </div>
                          ) : (
                            <Circle size={30} className="text-gray-300" strokeWidth={1.5} />
                          )}
                        </div>
                        {/* label */}
                        <div className="pt-0.5">
                          <p className={`text-sm font-semibold ${done || current ? 'text-gray-900' : 'text-gray-400'}`}>
                            {label}
                          </p>
                          {current && (
                            <p className="text-xs text-lime-600 font-medium mt-0.5">In progress</p>
                          )}
                          {done && (
                            <p className="text-xs text-gray-400 mt-0.5">Completed</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-lime-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] px-6 py-5 flex flex-col gap-3">
              <Link
                to="/my-orders"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-800 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <ArrowLeft size={14} /> Back to My Orders
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 rounded-full bg-[#0D0D0D] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-700"
              >
                Continue shopping <ArrowRight size={14} />
              </Link>
              {canCancel && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  disabled={cancelling}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-red-300 px-6 py-3 text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? (
                    <><Loader2 size={14} className="animate-spin" /> Cancelling…</>
                  ) : (
                    <><XCircle size={14} /> Cancel order</>
                  )}
                </button>
              )}
            </div>

            {/* Eco note */}
            <div className="rounded-xl border border-lime-200 bg-lime-50/70 px-4 py-3 flex items-center gap-3">
              <Leaf size={16} className="text-lime-600 shrink-0" fill="currentColor" />
              <p className="text-xs text-lime-800 leading-relaxed">
                Every order supports local sustainable vendors and low-waste packaging.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CancelConfirmModal
        open={cancelModalOpen}
        title="Cancel order?"
        message="This action cannot be undone."
        onConfirm={handleCancel}
        onCancel={() => !cancelling && setCancelModalOpen(false)}
        loading={cancelling}
      />
    </div>
  );
}
