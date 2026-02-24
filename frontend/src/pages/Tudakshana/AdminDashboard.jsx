import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/Tudakshana/adminService';
import { authHelpers } from '../../services/Tudakshana/authService';
import AdminProducts from '../Lakna/AdminProducts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const userRole = authHelpers.getUserRole();
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    fetchStats();
    if (activeTab === 'users') {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeTab, navigate]);

  const fetchStats = async () => {
    try {
      // Check if using hardcoded admin credentials
      const token = localStorage.getItem('token');
      if (token === 'admin-token-hardcoded') {
        // Set mock stats for hardcoded admin
        setStats({
          total: 0,
          active: 0,
          byRole: {
            admin: 1,
            seller: 0,
            customer: 0
          }
        });
        return;
      }
      
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default stats on error
      setStats({
        total: 0,
        active: 0,
        byRole: {
          admin: 1,
          seller: 0,
          customer: 0
        }
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Check if using hardcoded admin credentials
      const token = localStorage.getItem('token');
      if (token === 'admin-token-hardcoded') {
        // Set empty users list for hardcoded admin
        setUsers([]);
        setPagination({ total: 0, page: 1, pages: 0, limit: 10 });
        setError('');
        setLoading(false);
        return;
      }
      
      console.log('Fetching users with filters:', filters);
      const response = await adminAPI.getAllUsers(filters);
      console.log('Users response:', response);
      
      if (response && response.data && response.data.users) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
        setError('');
      } else {
        console.error('Invalid response structure:', response);
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Error fetching users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleToggleStatus = async (userId) => {
    // Check if using hardcoded admin credentials
    const token = localStorage.getItem('token');
    if (token === 'admin-token-hardcoded') {
      setError('This feature requires a real backend connection. Please use a database-connected admin account.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      const response = await adminAPI.toggleUserStatus(userId);
      setSuccess(response.message);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error toggling user status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Check if using hardcoded admin credentials
    const token = localStorage.getItem('token');
    if (token === 'admin-token-hardcoded') {
      setError('This feature requires a real backend connection. Please use a database-connected admin account.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await adminAPI.deleteUser(userId);
      setSuccess(response.message);
      fetchUsers();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    authHelpers.clearAuth();
    navigate('/');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'seller':
        return 'badge-seller';
      case 'customer':
        return 'badge-customer';
      default:
        return 'badge-default';
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardView();
      case 'users':
        return renderUsersView();
      case 'orders':
        return <div className="coming-soon">Order Management - Coming Soon</div>;
      case 'customers':
        return <div className="coming-soon">Customers - Coming Soon</div>;
      case 'add-product':
        return <AdminProducts mode="add" />;
      case 'products':
        return <AdminProducts mode="list" />;
      case 'reviews':
        return <div className="coming-soon">Reviews - Coming Soon</div>;
      case 'profile':
        return <div className="coming-soon">Profile - Coming Soon</div>;
      default:
        return renderDashboardView();
    }
  };

  const renderDashboardView = () => (
    <>
      <div className="dashboard-welcome">
        <h2>Admin Dashboard</h2>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card stat-orders">
            <div className="stat-icon">🛍️</div>
            <div className="stat-info">
              <p className="stat-label">Total Orders</p>
              <h3 className="stat-value">6</h3>
            </div>
          </div>
          <div className="stat-card stat-revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <p className="stat-label">Total Revenue</p>
              <h3 className="stat-value">LKR 19510.00</h3>
            </div>
          </div>
          <div className="stat-card stat-products">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <p className="stat-label">Total Products</p>
              <h3 className="stat-value">5</h3>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <p className="stat-label">Pending Orders</p>
              <h3 className="stat-value">0</h3>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="section-header">
          <h3>Analytics Dashboard</h3>
          <div className="analytics-controls">
            <button className="btn-icon">📅</button>
            <select className="period-select">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
            <button className="btn-download">📥 Download Report</button>
          </div>
        </div>
        <div className="analytics-grid">
          <div className="chart-card">
            <h4>Orders & Revenue</h4>
            <div className="chart-placeholder">
              <p>Chart visualization coming soon...</p>
            </div>
          </div>
          <div className="chart-card">
            <h4>New Users</h4>
            <div className="chart-placeholder">
              <p>Chart visualization coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderUsersView = () => (
    <>
      <div className="users-header">
        <h2>Users Management</h2>
        <p>Manage all users, roles, and permissions</p>
      </div>

      {/* User Statistics */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">{stats.total}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <p className="stat-label">Active Users</p>
              <h3 className="stat-value">{stats.active}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-info">
              <p className="stat-label">Admins</p>
              <h3 className="stat-value">{stats.byRole.admin}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-info">
              <p className="stat-label">Sellers</p>
              <h3 className="stat-value">{stats.byRole.seller}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <p className="stat-label">Customers</p>
              <h3 className="stat-value">{stats.byRole.customer}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>

        <select
          className="filter-select"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
          <option value="customer">Customer</option>
        </select>

        <select
          className="filter-select"
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      {loading && !users.length ? (
        <div className="loader">Loading users...</div>
      ) : users.length > 0 ? (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className="btn-action btn-toggle"
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? '🔒' : '🔓'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn-action btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No users found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === pagination.pages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">🌿</span>
            <span className="brand-name">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-section-title">MAIN MENU</h4>
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">Users List</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">Order Management</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Customers</span>
            </button>
          </div>

          <div className="nav-section">
            <h4 className="nav-section-title">PRODUCT</h4>
            <button
              className={`nav-item ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              <span className="nav-icon">➕</span>
              <span className="nav-text">Add Products</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Product List</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <span className="nav-icon">⭐</span>
              <span className="nav-text">Reviews</span>
            </button>
          </div>

          <div className="nav-section">
            <h4 className="nav-section-title">ADMIN</h4>
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search data, users, or reports"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Sign Out
          </button>
        </header>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            ✓ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            ✕ {error}
          </div>
        )}

        <div className="content-area">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
