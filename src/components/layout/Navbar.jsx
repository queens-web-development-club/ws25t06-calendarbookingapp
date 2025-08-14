import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-qweb-800 to-qweb-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center">
                {/* QWeb Logo */}
                <div className="relative">
                  {/* Gradient Q */}
                  <div className="w-10 h-10 bg-gradient-to-b from-qweb-blue-500 to-qweb-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    Q
                  </div>
                  {/* Tail extending from Q */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-b from-qweb-blue-500 to-qweb-green-500 rounded-full"></div>
                </div>
                {/* web tag */}
                <span className="ml-2 text-xl font-mono font-bold text-white">&lt;web&gt;</span>
              </div>
              <span className="text-xl font-bold text-white ml-2">Queen's Web Development</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/meetings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/meetings') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              Team Meetings
            </Link>
            <Link
              to="/interviews"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/interviews') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              Interviews
            </Link>
            {user && (
              <Link
                to="/bookings"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/bookings') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                My Bookings
              </Link>
            )}
          </div>

          {/* User Menu / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white/90">Welcome, {user.displayName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-qweb-blue-500 to-qweb-green-500 hover:from-qweb-blue-600 hover:to-qweb-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/90 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-qweb-700 rounded-b-lg">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/meetings"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/meetings') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Team Meetings
              </Link>
              <Link
                to="/interviews"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/interviews') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Interviews
              </Link>
              {user && (
                <Link
                  to="/bookings"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/bookings') 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              {user ? (
                <div className="pt-4 pb-3 border-t border-white/20">
                  <div className="px-3 py-2 text-white/90">
                    Welcome, {user.displayName || user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-red-300 hover:text-white hover:bg-white/10 rounded-md text-base font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-white/20 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-gradient-to-r from-qweb-blue-500 to-qweb-green-500 hover:from-qweb-blue-600 hover:to-qweb-green-600 text-white rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
