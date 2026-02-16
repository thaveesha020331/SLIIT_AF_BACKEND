import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home'
import UserProducts from './pages/Lakna/UserProducts'
import Cart from './pages/Thaveesha/Cart'
import MyOrders from './pages/Thaveesha/MyOrders'
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
      </Routes>
    </Router>
  )
}

export default App