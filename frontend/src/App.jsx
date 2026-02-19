import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home'
import UserProducts from './pages/Lakna/UserProducts'
import Cart from './pages/Thaveesha/Cart'
import MyOrders from './pages/Thaveesha/MyOrders'
import MyReviewPage from './pages/Senara/MyReviewPage'
import UserLogin from './pages/Tudakshana/UserLogin'
import AdminLogin from './pages/Tudakshana/AdminLogin'
import SellerLogin from './pages/Tudakshana/SellerLogin'
import SignUp from './pages/Tudakshana/SignUp'
import AdminDashboard from './pages/Tudakshana/AdminDashboard'
import SellerDashboard from './pages/Tudakshana/SellerDashboard'
import UserProfile from './pages/Tudakshana/UserProfile'
import ProtectedRoute from './components/Tudakshana/ProtectedRoute'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<UserProducts />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-orders" 
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-reviews" 
          element={
            <ProtectedRoute>
              <MyReviewPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Only Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Seller Only Routes */}
        <Route 
          path="/seller/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App