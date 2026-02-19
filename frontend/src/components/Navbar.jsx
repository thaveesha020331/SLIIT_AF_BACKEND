import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { authHelpers } from '../services/Tudakshana/authService'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const authenticated = authHelpers.isAuthenticated()
        setIsAuthenticated(authenticated)
        if (authenticated) {
          const user = authHelpers.getUser()
          setUserName(user?.name || 'User')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setUserName('')
      }
    }

    checkAuth()
    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

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
    { name: 'About Us', href: '#' },
    { name: 'Products', href: '/products' },
    { name: 'My Orders', href: '/my-orders' },
    { name: 'My Reviews', href: '/my-reviews' },
    { name: 'Contact Us', href: '#' },
  ]

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 md:px-12 lg:px-20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a
            href="#"
            className="text-2xl font-serif font-bold text-dark tracking-tight"
          >
            Eco<span className="text-lime-800">.</span>Mart
          </a>
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
                className="px-6 py-2.5 text-xs font-bold tracking-wider border-2 border-dark rounded-full hover:bg-dark hover:text-white transition-all duration-300 uppercase"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 text-xs font-bold tracking-wider bg-dark text-white rounded-full hover:bg-lime-800 transition-all duration-300 uppercase"
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
              <ShoppingBag size={20} />
              <span>Cart</span>
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