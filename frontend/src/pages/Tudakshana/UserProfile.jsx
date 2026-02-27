import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, authHelpers } from '../../services/Tudakshana/authService';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      setFormData({
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile(formData);
      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    authHelpers.clearAuth();
    navigate('/');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-badge-admin';
      case 'seller':
        return 'role-badge-seller';
      case 'customer':
        return 'role-badge-customer';
      default:
        return 'role-badge-default';
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={handleLogout} className="btn-logout">
          Sign Out
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info-section">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-basic-info">
              <h2>{user?.name}</h2>
              <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
                {user?.role?.toUpperCase()}
              </span>
              <p className="profile-status">
                Status: <span className={user?.isActive ? 'status-active' : 'status-inactive'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p className="profile-joined">
                Member since: {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <div className="profile-details">
              <div className="detail-row">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{user?.phone || 'Not provided'}</span>
              </div>
              <div className="profile-actions">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn-primary"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)} 
                  className="btn-secondary"
                >
                  {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-edit-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      phone: user.phone || ''
                    });
                  }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="password-change-form">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
