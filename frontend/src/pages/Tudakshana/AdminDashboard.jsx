import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/Tudakshana/adminService';
import { authHelpers } from '../../services/Tudakshana/authService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const userRole = authHelpers.getUserRole();
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    fetchStats();
    fetchUsers();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
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
    navigate('/admin/login');
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

  if (loading && !users.length) {
    return (
      <div className="admin-dashboard">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>👨‍💼 Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">
            Sign Out
          </button>
        </div>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.active}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-info">
              <h3>{stats.byRole.admin}</h3>
              <p>Admins</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-info">
              <h3>{stats.byRole.seller}</h3>
              <p>Sellers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <h3>{stats.byRole.customer}</h3>
              <p>Customers</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <button type="submit">Search</button>
        </form>

        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
          <option value="customer">Customer</option>
        </select>

        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      {users.length > 0 ? (
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
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
