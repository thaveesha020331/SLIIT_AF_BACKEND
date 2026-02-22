import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { authHelpers } from '../services/Tudakshana/authService'
import { cartAPI } from '../services/Thaveesha'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const authenticated = authHelpers.isAuthenticated()
        setIsAuthenticated(authenticated)
        if (authenticated) {
          const user = authHelpers.getUser()
          setUserName(user?.name || 'User')
        } else {
          setCartCount(0)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setUserName('')
        setCartCount(0)
      }
    }

    checkAuth()
    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Fetch cart count when authenticated (and on route change so it updates after cart actions)
  useEffect(() => {
    if (!isAuthenticated) return
    cartAPI.getCart()
      .then(({ items }) => {
        setCartCount((items || []).reduce((sum, i) => sum + (i.quantity || 1), 0))
      })
      .catch(() => setCartCount(0))
  }, [isAuthenticated, location.pathname])

  const handleLogout = () => {
    try {
      authHelpers.clearAuth()
      setIsAuthenticated(false)
      setUserName('')
      navigate('/login')
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'My Orders', href: '/my-orders' },
    { name: 'My Reviews', href: '/my-reviews' },
    { name: 'Contact Us', href: '/' },
  ]

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8 lg:px-10">
        {/* Logo */}
        <div className="flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight bg-transparent border-none cursor-pointer"
          >
            Eco<span className="text-lime-700">.</span>Mart
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.href)}
              className="text-xs lg:text-sm font-medium text-gray-700 tracking-wide hover:text-lime-700 transition-colors uppercase bg-none border-none cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => navigate('/cart')}
            className="relative text-gray-700 hover:text-lime-700 transition-colors p-1"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-lime-600 text-white text-xs font-bold px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-gray-700 hover:text-lime-700 transition-colors"
                aria-label="Profile"
              >
                <User size={20} />
                <span className="text-xs font-medium">{userName}</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold tracking-wider border-2 border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors uppercase"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-bold tracking-wider border-2 border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors uppercase"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-xs font-bold tracking-wider bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors uppercase"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 p-2 rounded hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden py-4 px-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                navigate(link.href)
                setIsMenuOpen(false)
              }}
              className="text-sm font-medium text-gray-800 py-3 px-2 text-left bg-none border-none cursor-pointer hover:bg-gray-50 rounded"
            >
              {link.name}
            </button>
          ))}
          <div className="flex flex-col gap-1 pt-3 border-t border-gray-200">
            <button
              onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}
              className="flex items-center gap-2 text-gray-800 font-medium bg-none border-none cursor-pointer py-3 px-2 hover:bg-gray-50 rounded"
            >
              <span className="relative inline-block">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-lime-600 text-white text-xs font-bold px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
              <span>Cart{cartCount > 0 ? ` (${cartCount})` : ''}</span>
            </button>
            
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 text-gray-800 font-medium bg-none border-none cursor-pointer py-3 px-2 hover:bg-gray-50 rounded"
                >
                  <User size={20} />
                  <span>{userName}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-bold border-2 border-gray-800 rounded-full uppercase bg-white text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-xs font-bold border-2 border-gray-800 rounded-full uppercase bg-white text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                  className="px-4 py-2 text-xs font-bold bg-gray-800 text-white rounded-full uppercase text-left"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}