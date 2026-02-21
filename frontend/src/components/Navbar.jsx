import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { authHelpers } from '../services/Tudakshana/authService'
import api from '../services/Tudakshana/authService'

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
    api.get('/cart')
      .then((res) => {
        const items = res.data?.items || []
        setCartCount(items.reduce((sum, i) => sum + (i.quantity || 1), 0))
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
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 md:px-12 lg:px-20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-serif font-bold text-dark tracking-tight bg-transparent border-none cursor-pointer"
          >
            Eco<span className="text-lime-800">.</span>Mart
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.href)}
              className="text-xs lg:text-sm font-medium text-dark tracking-widest hover:text-lime-800 transition-colors uppercase bg-none border-none cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => navigate('/cart')}
            className="text-dark hover:text-lime-800 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
          </button>
          
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 text-dark hover:text-lime-800 transition-colors"
                aria-label="Profile"
              >
                <User size={20} />
                <span className="text-xs font-medium">{userName}</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 text-xs font-bold tracking-wider border-2 border-dark rounded-full hover:bg-dark hover:text-white transition-all duration-300 uppercase"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-xs font-bold tracking-wider border-2 border-dark rounded-full hover:bg-[#0D0D0D] hover:text-white transition-all duration-300 uppercase"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 text-xs font-bold tracking-wider bg-dark text-white rounded-full hover:bg-[#0D0D0D] transition-all duration-300 uppercase"
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
            className="text-dark p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden py-6 px-6 flex flex-col space-y-4 border-t border-gray-100">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                navigate(link.href)
                setIsMenuOpen(false)
              }}
              className="text-sm font-bold text-dark tracking-widest py-2 border-b border-gray-50 text-left bg-none border-none cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}
              className="flex items-center space-x-2 text-dark font-medium bg-none border-none cursor-pointer py-2"
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
                  className="flex items-center space-x-2 text-dark font-medium bg-none border-none cursor-pointer py-2"
                >
                  <User size={20} />
                  <span>{userName}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-xs font-bold border-2 border-dark rounded-full uppercase bg-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="px-6 py-2 text-xs font-bold border-2 border-dark rounded-full uppercase bg-white"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                  className="px-6 py-2 text-xs font-bold bg-dark text-white rounded-full uppercase"
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