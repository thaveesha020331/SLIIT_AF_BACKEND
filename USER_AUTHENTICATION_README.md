# User Management & Authentication System

## Overview
Complete authentication system with role-based access control for Admin, Seller, and Customer roles.

## Features
- ✅ User registration & login
- ✅ JWT authentication
- ✅ Role-based access control (Admin, Seller, Customer)
- ✅ Profile management
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Separate login pages for each role

## Tech Stack
**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- CORS enabled

**Frontend:**
- React
- Axios for API calls
- React Router for navigation
- localStorage for token management

## Backend Structure

### Models
- **User Model**: `/models/Tudakshana/User.js`
  - Fields: name, email, password, role, phone, address, isActive, profileImage
  - Roles: admin, seller, customer
  - Password hashing on save
  - Password comparison method

### Controllers
- **Auth Controller**: `/controllers/Tudakshana/authController.js`
  - `register` - Register new user
  - `login` - User login with role validation
  - `getProfile` - Get user profile (protected)
  - `updateProfile` - Update user profile (protected)
  - `changePassword` - Change password (protected)

### Middleware
- **Auth Middleware**: `/utills/Tudakshana/authMiddleware.js`
  - `protect` - Verify JWT token
  - `restrictTo` - Restrict access to specific roles
  - `isAdmin` - Admin-only access
  - `isSeller` - Seller-only access
  - `isCustomer` - Customer-only access

### Routes
- **Auth Routes**: `/routes/Tudakshana/authRoutes.js`
  - `POST /api/auth/register` - Register user
  - `POST /api/auth/login` - Login user
  - `GET /api/auth/profile` - Get profile (protected)
  - `PUT /api/auth/profile` - Update profile (protected)
  - `PUT /api/auth/password` - Change password (protected)

## Frontend Structure

### Services
- **Auth Service**: `/frontend/src/services/Tudakshana/authService.js`
  - Axios instance with interceptors
  - Auth API methods (register, login, getProfile, etc.)
  - Auth helpers (saveAuth, getAuth, clearAuth, etc.)

### Components
- **AdminLogin**: `/frontend/src/pages/Tudakshana/AdminLogin.jsx`
- **SellerLogin**: `/frontend/src/pages/Tudakshana/SellerLogin.jsx`
- **UserLogin**: `/frontend/src/pages/Tudakshana/UserLogin.jsx`
- **SignUp**: `/frontend/src/pages/Tudakshana/SignUp.jsx`

## API Endpoints

### Public Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",  // Optional: admin, seller, customer (default: customer)
  "phone": "1234567890",  // Optional
  "address": {  // Optional
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"  // Optional: validates user has this role
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints (Require Authorization Header)

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "phone": "1234567890",
      "address": {...},
      "isActive": true,
      "createdAt": "2026-02-18T..."
    }
  }
}
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210",
  "address": {...},
  "profileImage": "https://..."
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {...}
  }
}
```

#### Change Password
```http
PUT /api/auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Setup Instructions

### Backend Setup

1. **Install dependencies:**
```bash
npm install
```

Required packages:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cors

2. **Configure environment variables:**
Create/update `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

3. **Start the server:**
```bash
npm start        # Production
npm run dev      # Development (with nodemon)
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

Required packages:
- react
- react-router-dom
- axios

3. **Configure API URL:**
Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server:**
```bash
npm run dev
```

## Usage

### Registration
1. Navigate to `/signup`
2. Fill in the registration form
3. Select account type (Customer, Seller, or Admin)
4. Submit the form
5. User will be automatically logged in and redirected based on role

### Login
Three separate login pages:
- **Customer Login**: `/login`
- **Seller Login**: `/seller/login`
- **Admin Login**: `/admin/login`

Each login page validates that the user has the correct role.

### Role-Based Redirects
After successful login:
- **Admin** → `/admin/dashboard`
- **Seller** → `/seller/dashboard`
- **Customer** → `/products`

### Using Protected Routes
To protect routes on the backend, use middleware:
```javascript
import { protect, restrictTo } from './utills/Tudakshana/authMiddleware.js';

// Protect route (any authenticated user)
router.get('/protected', protect, controller);

// Admin only
router.get('/admin', protect, restrictTo('admin'), controller);

// Seller or Admin
router.get('/seller', protect, restrictTo('seller', 'admin'), controller);
```

### Frontend Auth Helpers
```javascript
import { authHelpers } from './services/Tudakshana/authService';

// Check if authenticated
if (authHelpers.isAuthenticated()) {
  // User is logged in
}

// Get user role
const role = authHelpers.getUserRole();

// Check specific role
if (authHelpers.hasRole('admin')) {
  // User is admin
}

// Clear auth data (logout)
authHelpers.clearAuth();
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
2. **JWT Tokens**: 7-day expiration, signed with secret key
3. **Role Validation**: Login endpoints can validate user role
4. **Protected Routes**: Middleware verifies JWT on protected endpoints
5. **Token Interceptor**: Frontend automatically includes token in requests
6. **Auto Logout**: Invalid/expired tokens trigger automatic logout

## Error Handling

Common error responses:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials, expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user doesn't exist)
- `500` - Internal Server Error

## Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Future Enhancements
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, Facebook)
- [ ] Refresh tokens
- [ ] Session management
- [ ] Account lockout after failed attempts
- [ ] Activity logging

## Support
For issues or questions, contact the development team.

---
**Last Updated**: February 18, 2026
**Version**: 1.0.0
