import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from './pages/Home'
import UserProducts from './pages/Lakna/UserProducts'
import Cart from './pages/Thaveesha/Cart'
import MyOrders from './pages/Thaveesha/MyOrders'
import OrderDetail from './pages/Thaveesha/OrderDetail'
import MyReviewPage from './pages/Senara/MyReviewPage'
import ProductReviewPage from './pages/Senara/ProductReviewPage'
import UserLogin from './pages/Tudakshana/UserLogin'
import SellerLogin from './pages/Tudakshana/SellerLogin'
import SignUp from './pages/Tudakshana/SignUp'
import AdminDashboard from './pages/Tudakshana/AdminDashboard'
import AdminProducts from './pages/Lakna/AdminProducts'
import SellerDashboard from './pages/Tudakshana/SellerDashboard'
import UserProfile from './pages/Tudakshana/UserProfile'
import ProtectedRoute from './components/Tudakshana/ProtectedRoute'
import { Navbar } from './components/Navbar'

function AppContent() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/admin/products'

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<UserProducts />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* User Routes - require login for cart & orders */}
          <Route path="/profile" element={<UserProfile />} />
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
            path="/my-orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/my-reviews" element={<MyReviewPage />} />
          <Route path="/products/:productId/review" element={ <ProductReviewPage />}/>
          
          {/* Admin Only Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />

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
      </main>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App