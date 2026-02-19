# Test Users Quick Reference

## 🎯 Test Credentials

All test users have been created and are ready to use!

### Admin User
- **Email:** admin@test.com
- **Password:** admin123
- **Login URL:** http://localhost:5173/admin/login
- **Access:** Full system access, user management

### Seller User
- **Email:** seller@test.com
- **Password:** seller123
- **Login URL:** http://localhost:5173/seller/login
- **Access:** Product management, orders, reviews

### Customer User
- **Email:** customer@test.com
- **Password:** customer123
- **Login URL:** http://localhost:5173/login
- **Access:** Browse products, make purchases, write reviews

---

## ✅ What Was Fixed

### Navigation Issues Resolved
1. **Removed setTimeout delays** - All login and signup pages now redirect immediately after successful authentication
2. **Added `replace: true`** - Prevents users from going back to login pages using browser back button
3. **Fixed redirect logic** - Proper role-based redirection:
   - Admin → `/admin/dashboard`
   - Seller → `/seller/dashboard`
   - Customer → `/products`

### Files Updated
- [AdminLogin.jsx](frontend/src/pages/Tudakshana/AdminLogin.jsx) - Immediate navigation
- [UserLogin.jsx](frontend/src/pages/Tudakshana/UserLogin.jsx) - Immediate navigation with role check
- [SellerLogin.jsx](frontend/src/pages/Tudakshana/SellerLogin.jsx) - Immediate navigation
- [SignUp.jsx](frontend/src/pages/Tudakshana/SignUp.jsx) - Immediate redirect to login

---

## 🚀 How to Test

### Test Admin Login
```bash
# 1. Go to admin login page
http://localhost:5173/admin/login

# 2. Enter credentials
Email: admin@test.com
Password: admin123

# 3. Should redirect to: http://localhost:5173/admin/dashboard
# You'll see the admin dashboard with user management features
```

### Test Seller Login
```bash
# 1. Go to seller login page
http://localhost:5173/seller/login

# 2. Enter credentials
Email: seller@test.com
Password: seller123

# 3. Should redirect to: http://localhost:5173/seller/dashboard
# You'll see the seller dashboard
```

### Test Customer Login
```bash
# 1. Go to customer login page
http://localhost:5173/login

# 2. Enter credentials
Email: customer@test.com
Password: customer123

# 3. Should redirect to: http://localhost:5173/products
# You'll see the products page
```

---

## 🔧 Creating More Test Users

### Create Only Admin
```bash
npm run create-admin
```

### Create All Test Users (Admin, Seller, Customer)
```bash
npm run create-test-users
```

### Manual User Creation
You can also register new users through the signup page:
http://localhost:5173/signup

---

## 📝 Testing Checklist

- [ ] Admin login redirects to `/admin/dashboard`
- [ ] Seller login redirects to `/seller/dashboard`
- [ ] Customer login redirects to `/products`
- [ ] After login, user name appears in navbar
- [ ] Clicking user name goes to `/profile`
- [ ] Profile page shows user information
- [ ] Edit profile button works
- [ ] Change password works
- [ ] Logout button works and returns to login
- [ ] Trying to access protected routes while logged out redirects to login
- [ ] Already logged in users are redirected from login pages
- [ ] Admin dashboard shows all users
- [ ] Admin can toggle user status
- [ ] Admin can delete users

---

## 🐛 If Issues Persist

### Clear Browser Storage
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear Local Storage
4. Refresh page

### Check Backend is Running
```bash
# Should show: Server running on port 5001
cd /Users/tudakshanajayawardhana/Desktop/AF\ Project/SLIIT_AF_BACKEND
npm start
```

### Check MongoDB is Running
```bash
brew services list
# mongodb-community should show "started"
```

### Check Frontend is Running
```bash
cd frontend
npm run dev
# Should show: Local: http://localhost:5173
```

### View Browser Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Check for any error messages
4. Share the errors if you see any

---

## 📧 Support

If you encounter any issues:
1. Check the browser console for errors (F12 → Console tab)
2. Check the backend terminal for API errors
3. Verify all services are running (backend, frontend, MongoDB)
4. Clear browser localStorage and try again
