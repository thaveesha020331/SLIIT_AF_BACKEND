# Admin Dashboard & Authentication Updates

## What Was Implemented

### 1. Admin Dashboard Backend ✅

**Controller**: `controllers/Tudakshana/adminController.js`
- `getAllUsers()` - Get all users with filters (role, status, search, pagination)
- `getUserById()` - Get specific user details
- `updateUser()` - Update user information (name, email, role, status)
- `deleteUser()` - Delete a user (prevents self-deletion)
- `toggleUserStatus()` - Activate/deactivate users
- `getUserStats()` - Get user statistics dashboard

**Routes**: `routes/Tudakshana/adminRoutes.js`
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/users` - Get all users (with filters)
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user status

**Security**: All admin routes are protected with:
- `protect` middleware - Requires valid JWT token
- `isAdmin` middleware - Requires admin role

### 2. Admin Dashboard Frontend ✅

**Component**: `frontend/src/pages/Tudakshana/AdminDashboard.jsx`

Features:
- ✅ **Statistics Cards**: Total users, active users, admins, sellers, customers
- ✅ **User Management Table**: View all users with their details
- ✅ **Search & Filters**: Search by name/email, filter by role and status
- ✅ **Pagination**: Navigate through large user lists
- ✅ **Actions**:
  - Toggle user active/inactive status
  - Delete users (with confirmation)
- ✅ **Sign Out Button**: Logout functionality in header
- ✅ **Role-based Access**: Only admins can access

**Service**: `frontend/src/services/Tudakshana/adminService.js`
- API integration for all admin operations

**Styles**: `frontend/src/pages/Tudakshana/AdminDashboard.css`
- Modern, responsive design
- Color-coded role badges
- Interactive hover effects

### 3. Updated SignUp Flow ✅

**Changed**: `frontend/src/pages/Tudakshana/SignUp.jsx`

**Old Behavior**: Auto-login after signup, redirect to role-based dashboard
**New Behavior**: Redirect to appropriate login page after signup
- Admin → `/admin/login`
- Seller → `/seller/login`
- Customer → `/login`

### 4. Logout Functionality ✅

**Implemented in**:
- `AdminDashboard.jsx` - Sign Out button in header
- Uses `authHelpers.clearAuth()` to remove token and user data
- Redirects to appropriate login page

---

## API Endpoints

### Admin Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "stats": {
      "total": 10,
      "active": 8,
      "inactive": 2,
      "byRole": {
        "admin": 1,
        "seller": 3,
        "customer": 6
      }
    }
  }
}
```

### Get All Users
```http
GET /api/admin/users?role=customer&isActive=true&search=john&page=1&limit=10
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

### Toggle User Status
```http
PATCH /api/admin/users/:id/toggle-status
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "isActive": true
    }
  }
}
```

### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## How to Use

### 1. Create an Admin User

First, register an admin account:
- Go to `http://localhost:5173/signup`
- Fill in details and select **"Admin"** as Account Type
- Click "Create Account"
- You'll be redirected to **Admin Login** page

### 2. Login as Admin

- Go to `http://localhost:5173/admin/login`
- Enter your admin credentials
- You'll be redirected to **Admin Dashboard**

### 3. Admin Dashboard Features

**View Statistics**
- See total users, active users, and counts by role in cards at the top

**Search & Filter Users**
- Use search bar to find users by name or email
- Filter by role (Admin, Seller, Customer)
- Filter by status (Active, Inactive)

**Manage Users**
- **Toggle Status**: Click 🔒 to deactivate or 🔓 to activate a user
- **Delete User**: Click 🗑️ to delete a user (requires confirmation)

**Sign Out**
- Click "Sign Out" button in the header to logout

---

## Frontend Routes

Add these routes to your React Router configuration:

```jsx
import AdminDashboard from './pages/Tudakshana/AdminDashboard';

// In your router:
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

---

## Current Configuration

### Backend
- **Port**: 5001 (changed from 5000 due to macOS AirPlay conflict)
- **MongoDB**: Local MongoDB at `localhost:27017`
- **Database**: `sliit_af_db`

### Frontend
- **Port**: 5173 (Vite dev server)
- **API URL**: `http://localhost:5001/api`

---

## Testing the Admin Dashboard

### Method 1: Using cURL

**1. Login as Admin**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

Save the `token` from the response.

**2. Get User Statistics**
```bash
curl http://localhost:5001/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**3. Get All Users**
```bash
curl http://localhost:5001/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**4. Delete a User**
```bash
curl -X DELETE http://localhost:5001/api/admin/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Method 2: Using Frontend

1. **Create test users**:
   - Create 1 admin user
   - Create 2-3 seller users
   - Create 3-4 customer users

2. **Login as admin** at `/admin/login`

3. **Test dashboard features**:
   - View statistics
   - Search for users
   - Filter by role
   - Toggle user status
   - Delete a user

---

## Security Features

✅ **Protected Routes**: All admin endpoints require authentication
✅ **Role-Based Access**: Only admins can access admin endpoints
✅ **Self-Protection**: Admins cannot delete or deactivate themselves
✅ **JWT Verification**: All requests validated with JWT tokens
✅ **Password Security**: Passwords never returned in API responses

---

## MongoDB Compass - View Users

Connect to your database and navigate to:
- Database: `sliit_af_db`
- Collection: `users`

You'll see all registered users with their roles and status.

---

## Troubleshooting

### Problem: "Access denied. Admin privileges required"

**Solution**: Make sure:
1. You're logged in as an admin user
2. The user's role in database is set to `"admin"`
3. Your token is valid and not expired

### Problem: "Cannot delete your own account"

**Solution**: This is intentional security. Create another admin user if you need to delete your account.

### Problem: Admin dashboard not loading

**Solution**:
1. Check if backend is running on port 5001
2. Check browser console for errors
3. Verify you're logged in as admin
4. Check if token is stored in localStorage

---

## Next Steps

Possible enhancements:
- [ ] Edit user details modal
- [ ] Bulk operations (delete multiple users)
- [ ] Export users to CSV
- [ ] User activity logs
- [ ] Email notifications
- [ ] Advanced filtering options
- [ ] User profile pictures upload

---

**Last Updated**: February 18, 2026
**Version**: 1.0.0
