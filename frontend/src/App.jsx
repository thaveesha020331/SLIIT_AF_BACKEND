import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home'
import UserProducts from './pages/Lakna/UserProducts'
import Cart from './pages/Thaveesha/Cart'
import MyOrders from './pages/Thaveesha/MyOrders'
import MyReviewPage from './pages/Senara/MyReviewPage'
import UserLogin from './pages/Tudakshana/UserLogin'
import AdminLogin from './pages/Tudakshana/AdminLogin'
import SignUp from './pages/Tudakshana/SignUp'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<UserProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-reviews" element={<MyReviewPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App