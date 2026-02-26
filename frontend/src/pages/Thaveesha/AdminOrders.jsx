/**
 * Admin Order Management - Thaveesha
 * Admin can view all orders and update status via dropdown.
 * When order is delivered, the cancelled option is disabled in the dropdown.
 * When order is cancelled by user, admin cannot change the stage.
 * Search by customer name, email, or order ID.
 * Styled to match AdminReviewsPage.
 */
import React, { useState, useEffect } from 'react';
import { adminOrderAPI } from '../../services/Thaveesha/adminOrderService';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:    'bg-orange-50 text-orange-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped:    'bg-yellow-50 text-yellow-700',
  delivered:  'bg-green-50 text-green-700',
  cancelled:  'bg-red-50 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [successMsg, setSuccessMsg]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm]     = useState('');
  const [updatingId, setUpdatingId]     = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const data = await adminOrderAPI.getAllOrders(params);
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId);
    setError(null);
    try {
      const data = await adminOrderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? data.order : o))
      );
      showSuccess(`Order status updated to "${newStatus}"`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function formatDate(iso) {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('en-LK', { dateStyle: 'medium' });
  }

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch  = order.user?.name?.toLowerCase().includes(term);
    const emailMatch = order.user?.email?.toLowerCase().includes(term);
    const idMatch    = order._id?.toLowerCase().includes(term);
    return nameMatch || emailMatch || idMatch;
  });

  if (loading) {
    return (
      <div className="product-review-container">
        <div className="orders-loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="product-review-container">

      {/* Header */}
      <div className="product-review-header">
        <div className="product-review-header-title">
          <h1>Order Management</h1>
          <p>View and manage all customer orders</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5',
          color: '#dc2626', padding: '12px 16px', borderRadius: '8px',
          marginBottom: '16px', fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac',
          color: '#16a34a', padding: '12px 16px', borderRadius: '8px',
          marginBottom: '16px', fontSize: '14px',
        }}>
          {successMsg}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, email or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs text-gray-500">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          {searchTerm ? ` for "${searchTerm}"` : ''}
        </span>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-gray-500">
          {searchTerm ? `No orders found for "${searchTerm}"` : 'No orders found.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Change Status'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-semibold text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const busy = updatingId === order._id;
                const statusClass = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700';

                // Lock dropdown when order was cancelled by the user
                const lockedByUser = order.status === 'cancelled' && order.cancelledBy === 'user';

                return (
                  <tr key={order._id} className={busy ? 'bg-gray-50' : 'bg-white'}>

                    {/* Order ID */}
                    <td className="px-4 py-3 align-top">
                      <span className="font-mono text-xs text-gray-500">
                        ...{order._id.slice(-8)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3 align-top text-gray-900">
                      <div className="font-medium">{order.user?.name || 'Unknown'}</div>
                      {order.user?.email && (
                        <div className="text-xs text-gray-500">{order.user.email}</div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 align-top text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3 align-top text-gray-900">
                      {(order.items || []).slice(0, 2).map((line) => (
                        <div key={line._id} className="text-xs text-gray-700">
                          {line.product?.title || 'Item'} x {line.quantity}
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{order.items.length - 2} more
                        </div>
                      )}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 align-top font-semibold text-gray-900 whitespace-nowrap">
                      LKR {(order.total ?? 0).toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 align-top">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          disabled={busy || lockedByUser}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          style={{
                            cursor: (busy || lockedByUser) ? 'not-allowed' : 'pointer',
                            opacity: (busy || lockedByUser) ? 0.5 : 1,
                            width: '155px',
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => {
                            // When delivered, disallow switching to cancelled
                            const isDisabled = order.status === 'delivered' && s === 'cancelled';
                            return (
                              <option key={s} value={s} disabled={isDisabled}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                {isDisabled ? ' (not allowed)' : ''}
                              </option>
                            );
                          })}
                        </select>
                        {busy && (
                          <span className="text-xs text-gray-500">Saving...</span>
                        )}
                        {lockedByUser && !busy && (
                          <span className="text-xs text-red-400 whitespace-nowrap">
                            Cancelled by customer
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}