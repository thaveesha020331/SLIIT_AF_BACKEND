# Authentication System Documentation

## Overview
Complete authentication system with role-based access control for Admin, Seller, and Customer users. All authentication files are organized in the `Tudakshana` folders.

## Features Implemented

### 1. **User Roles**
- **Admin**: Full system access, user management capabilities
- **Seller**: Can manage products, orders, and view reviews
- **Customer**: Can browse products, make purchases, and write reviews

### 2. **Authentication Pages**

#### Login Pages
- **User Login** (`/login`) - For Customers and Sellers
- **Admin Login** (`/admin/login`) - Dedicated admin portal
- **Seller Login** (`/seller/login`) - Seller-specific login

#### Registration
- **Sign Up** (`/signup`) - New user registration with role selection

#### Protected Pages
- **User Profile** (`/profile`) - View and edit user information, change password
- **Admin Dashboard** (`/admin/dashboard`) - User management interface
- **Seller Dashboard** (`/seller/dashboard`) - Seller management interface

### 3. **Security Features**
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Automatic redirect for authenticated users
- Session persistence with localStorage
- Protected API endpoints

## File Structure

### Backend Files (in `Tudakshana` folders)

```
models/Tudakshana/
  └── User.js                    # User schema with roles and password hashing

controllers/Tudakshana/
  ├── authController.js          # Authentication logic (login, register, profile)
  └── adminController.js         # Admin operations (user management)

routes/Tudakshana/
  ├── authRoutes.js              # Auth endpoints (/api/auth/*)
  └── adminRoutes.js             # Admin endpoints (/api/admin/*)

utills/Tudakshana/
  └── authMiddleware.js          # JWT verification and role checks
```

### Frontend Files (in `Tudakshana` folders)

```
services/Tudakshana/
  ├── authService.js             # API calls and auth helpers
  └── adminService.js            # Admin API calls

pages/Tudakshana/
  ├── UserLogin.jsx              # Customer/Seller login page
  ├── AdminLogin.jsx             # Admin login page
  ├── SellerLogin.jsx            # Seller login page
  ├── SignUp.jsx                 # Registration page
  ├── AdminDashboard.jsx         # Admin user management
  ├── SellerDashboard.jsx        # Seller dashboard
  └── UserProfile.jsx            # User profile page

components/Tudakshana/
  └── ProtectedRoute.jsx         # Route protection wrapper
```

## API Endpoints

### Authentication Routes (`/api/auth`)

```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # User login
GET    /api/auth/profile        # Get current user profile (protected)
PUT    /api/auth/profile        # Update user profile (protected)
POST   /api/auth/change-password # Change user password (protected)
```

### Admin Routes (`/api/admin`) - Admin Only

```
GET    /api/admin/users         # Get all users (with filters, search, pagination)
GET    /api/admin/users/:id     # Get user by ID
PUT    /api/admin/users/:id     # Update user
DELETE /api/admin/users/:id     # Delete user
PATCH  /api/admin/users/:id/toggle-status  # Activate/Deactivate user
GET    /api/admin/stats         # Get user statistics
```

## User Flows

### 1. Registration Flow
1. User visits `/signup`
2. Fills in registration form (name, email, password, role)
3. Submits form → Creates account in database
4. Redirected to `/login` to sign in

### 2. Login Flow

#### Customer/Seller Login
1. User visits `/login`
2. Enters email and password
3. System validates credentials
4. On success:
   - Seller → Redirected to `/seller/dashboard`
   - Customer → Redirected to `/` (home page)

#### Admin Login
1. Admin visits `/admin/login`
2. Enters admin credentials
3. System verifies admin role
4. Redirected to `/admin/dashboard`

### 3. Already Logged In
- If user is already authenticated:
  - Trying to access login/signup pages → Auto-redirected to appropriate dashboard
  - Admin → `/admin/dashboard`
  - Seller → `/seller/dashboard`
  - Customer → `/` (home)

### 4. Protected Routes
- Unauthenticated users trying to access protected routes → Redirected to `/login`
- Users with wrong role → Redirected to their appropriate dashboard

### 5. Logout Flow
1. User clicks "Logout" button (in Dashboard or Navbar)
2. System clears authentication data
3. Redirected to `/login`

## Dashboard Features

### Admin Dashboard (`/admin/dashboard`)
- **User Statistics**: Total users, admins, sellers, customers, active/inactive counts
- **User Management**:
  - View all users in a table
  - Search by name or email
  - Filter by role (All, Admin, Seller, Customer)
  - Filter by status (All, Active, Inactive)
  - Pagination (10 users per page)
- **Actions**:
  - Toggle user active/inactive status
  - Delete users
  - View user details
- **Logout Button**: Sign out from admin account

### Seller Dashboard (`/seller/dashboard`)
- **Quick Links**: Products, Orders, Reviews, Profile
- **Dashboard Statistics**: Product count, order count, review count
- **Logout Button**: Sign out from seller account

### User Profile (`/profile`)
- **View Profile**: Name, email, phone, role, account status, join date
- **Edit Profile**: Update name, email, phone
- **Change Password**: Secure password update with confirmation
- **Logout Button**: Sign out from account

## Navbar Updates
The navbar now shows dynamic content based on authentication status:

### Not Logged In
- Login button → `/login`
- Sign Up button → `/signup`

### Logged In
- User name with profile icon
- Profile button → `/profile`
- Logout button → Clears session and redirects to login

## Environment Variables

### Backend (`.env`)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sliit_af_db
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

## How to Test

### 1. Start the Backend
```bash
cd /Users/tudakshanajayawardhana/Desktop/AF\ Project/SLIIT_AF_BACKEND
npm start
```
Backend runs on `http://localhost:5001`

### 2. Start MongoDB
```bash
brew services start mongodb-community
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### 4. Create Test Users

#### Create Admin User (via MongoDB or API)
```javascript
// Using MongoDB Compass or shell
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123", // Will be hashed
  "role": "admin",
  "isActive": true
}
```

#### Create Users via Sign Up Page
1. Visit `http://localhost:5173/signup`
2. Fill in the form
3. Select role (Customer, Seller, or Admin)
4. Submit

### 5. Test Login Flows

#### Test Admin Login
1. Visit `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Should redirect to `/admin/dashboard`
4. Try managing users

#### Test Seller Login
1. Visit `http://localhost:5173/seller/login` or `/login`
2. Login with seller credentials
3. Should redirect to `/seller/dashboard`

#### Test Customer Login
1. Visit `http://localhost:5173/login`
2. Login with customer credentials
3. Should redirect to home page `/`

### 6. Test Protected Routes
- While logged out, try to visit `/profile` → Should redirect to login
- While logged in as customer, try to visit `/admin/dashboard` → Should redirect to home
- While logged in as admin, try to visit `/admin/dashboard` → Should work

### 7. Test Profile Page
1. Login with any user
2. Click on username in navbar or visit `/profile`
3. Try editing profile information
4. Try changing password
5. Click logout button

## Security Considerations

1. **Password Security**: All passwords are hashed using bcrypt before storage
2. **JWT Tokens**: Secure token-based authentication with expiration
3. **Role Verification**: Both frontend and backend verify user roles
4. **Protected Routes**: Frontend routes wrapped with ProtectedRoute component
5. **Protected Endpoints**: Backend endpoints use middleware for authentication
6. **Input Validation**: Email validation, password strength checks, required fields

## Troubleshooting

### Login Not Redirecting
- **Fixed**: Added `/admin/dashboard` and `/seller/dashboard` routes to App.jsx
- **Fixed**: Added useEffect checks in login pages to redirect already authenticated users

### 401 Unauthorized Errors
- Check if JWT token is valid
- Check if token is being sent in Authorization header
- Verify MONGODB connection is active

### CORS Errors
- Backend CORS is configured for `http://localhost:5173`
- If using different port, update CORS config in Server.js

### Route Not Found
- All routes are now registered in App.jsx
- Protected routes use ProtectedRoute wrapper
- Check browser console for navigation errors

## Next Steps

### Recommended Enhancements
1. **Email Verification**: Add email confirmation for new registrations
2. **Password Reset**: Implement forgot password functionality
3. **Refresh Tokens**: Add refresh token mechanism for extended sessions
4. **Two-Factor Authentication**: Add 2FA for admin accounts
5. **Activity Logs**: Track user login/logout times and activities
6. **Profile Pictures**: Allow users to upload profile images
7. **Account Settings**: More granular privacy and notification settings

## Testing Checklist

- [ ] Register new customer account
- [ ] Register new seller account
- [ ] Login as customer → Redirects to home
- [ ] Login as seller → Redirects to seller dashboard
- [ ] Login as admin → Redirects to admin dashboard
- [ ] Access profile page while logged in
- [ ] Edit profile information
- [ ] Change password
- [ ] Logout from profile page
- [ ] Try accessing protected routes while logged out
- [ ] Admin: View all users
- [ ] Admin: Search users by name/email
- [ ] Admin: Filter users by role
- [ ] Admin: Toggle user active status
- [ ] Admin: Delete user
- [ ] Navbar shows correct buttons based on auth status
- [ ] Already logged in users redirected from login pages

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the backend terminal for API errors
3. Verify MongoDB is running: `brew services list`
4. Verify environment variables in `.env` files
5. Check network tab in browser dev tools for API responses
