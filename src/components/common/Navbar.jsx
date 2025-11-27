import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiSearch, 
  FiInfo, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiHeart,
  FiSettings
} from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Listings', path: '/listings', icon: FiSearch },
    { name: 'About', path: '/about', icon: FiInfo },
    { name: 'List With Us', path: '/list-with-us', icon: FiInfo },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold gradient-text"
            >
              UniBordima.lk
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-medium">
                    {user?.firstName || user?.username}
                  </span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                    >
                      {user?.role === 'student' && (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <FiUser className="w-4 h-4" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/saved-listings"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <FiHeart className="w-4 h-4" />
                            <span>Saved Listings</span>
                          </Link>
                        </>
                      )}
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <MdDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}

                      <hr className="my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}

              <hr className="my-2" />

              {isAuthenticated ? (
                <>
                  {user?.role === 'student' && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                      >
                        <FiUser className="w-5 h-5" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/saved-listings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                      >
                        <FiHeart className="w-5 h-5" />
                        <span>Saved Listings</span>
                      </Link>
                    </>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      <MdDashboard className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 w-full"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-center rounded-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;