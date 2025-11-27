import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiList, FiStar, FiUsers, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import Dashboard from '../components/admin/Dashboard';
import ListingManagement from '../components/admin/ListingManagement';
import ReviewModeration from '../components/admin/ReviewModeration';
import AnimatedPage from '../components/common/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FiHome },
    { id: 'listings', name: 'Manage Listings', icon: FiList },
    { id: 'reviews', name: 'Reviews', icon: FiStar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'listings':
        return <ListingManagement />;
      case 'reviews':
        return <ReviewModeration />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <motion.aside
            initial={false}
            animate={{
              x: sidebarOpen ? 0 : '-100%',
            }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-xl lg:shadow-none lg:translate-x-0`}
          >
            <div className="h-full flex flex-col">
              {/* Logo */}
              <div className="hidden lg:block p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold gradient-text">
                  UniBordima
                </h1>
                <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* User Info */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default AdminPanel;