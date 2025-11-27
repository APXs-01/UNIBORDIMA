import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiStar, FiEdit, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import AnimatedPage from '../components/common/AnimatedPage';
import ListingCard from '../components/student/ListingCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    university: user?.university || '',
  });

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedListings();
    }
  }, [activeTab]);

  const fetchSavedListings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/students/me');
      const listingPromises = data.student.savedListings.map((id) =>
        api.get(`/listings/${id}`)
      );
      const listings = await Promise.all(listingPromises);
      setSavedListings(listings.map((res) => res.data.listing));
    } catch (error) {
      console.error('Error fetching saved listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/students/profile', formData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FiUser },
    { id: 'saved', name: 'Saved Listings', icon: FiHeart },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.firstName}!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Profile Card */}
                <div className="p-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 mx-auto mb-4">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <h3 className="text-center font-semibold text-lg">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-center text-primary-100 text-sm">
                    {user?.email}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                    >
                      <FiEdit className="w-5 h-5" />
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            University
                          </label>
                          <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                      >
                        {loading ? 'Updating...' : 'Save Changes'}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FiUser className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Full Name</span>
                          </div>
                          <p className="text-gray-900 font-semibold">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FiMail className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Email</span>
                          </div>
                          <p className="text-gray-900 font-semibold">
                            {user?.email}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FiPhone className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Phone Number</span>
                          </div>
                          <p className="text-gray-900 font-semibold">
                            {user?.phoneNumber}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FiBook className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">University</span>
                          </div>
                          <p className="text-gray-900 font-semibold">
                            {user?.university}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FiUser className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Student ID</span>
                          </div>
                          <p className="text-gray-900 font-semibold">
                            {user?.studentId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Saved Listings Tab */}
              {activeTab === 'saved' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Saved Listings ({savedListings.length})
                    </h2>
                    <p className="text-gray-600">
                      Your favorite boarding places
                    </p>
                  </div>

                  {loading ? (
                    <Loader />
                  ) : savedListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedListings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No saved listings yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start saving listings to keep track of your favorites
                      </p>
                      <a href="/listings" className="btn-primary">
                        Browse Listings
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default StudentDashboard;