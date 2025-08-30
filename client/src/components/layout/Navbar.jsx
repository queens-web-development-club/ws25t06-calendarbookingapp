import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import qwebLogo from '../../assets/qweb_logo.jpg';

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
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center">
                {/* QWEB Logo */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                  <img src={qwebLogo} alt="QWEB Logo" className="w-8 h-8 object-contain" />
                </div>
                {/* Brand Text */}
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">QWEB</span>
                  <span className="block text-xs text-gray-500 font-medium">Booking Platform</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/interviews"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/interviews') 
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              Schedule Interview
            </Link>
            <Link
              to="/meetings"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/meetings') 
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              Team Coordination
            </Link>
            {user && (
              <Link
                to="/bookings"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/bookings') 
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm border border-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                }`}
              >
                Calendar
              </Link>
            )}
          </div>

          {/* User Menu / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Welcome back!</div>
                  <div className="text-xs text-gray-500">{user.displayName || user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 text-sm">QWEB member?</span>
                <Link
                  to="/"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-br from-gray-50 to-blue-50 rounded-b-lg border-t border-gray-200">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/interviews"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/interviews') 
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule Interview
              </Link>
              <Link
                to="/meetings"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/meetings') 
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Team Coordination
              </Link>
              {user && (
                <Link
                  to="/bookings"
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive('/bookings') 
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Calendar
                </Link>
              )}
              {user ? (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">Welcome back!</div>
                    <div className="text-xs text-gray-500">{user.displayName || user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg text-base font-medium transition-all duration-200 mt-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    QWEB member? Sign in on the home page
                  </div>
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
