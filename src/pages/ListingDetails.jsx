import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  FiMapPin,
  FiStar,
  FiHeart,
  FiPhone,
  FiMail,
  FiCheck,
  FiX,
  FiArrowLeft,
  FiCalendar,
  FiEye,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import AnimatedPage from '../components/common/AnimatedPage';
import MapView from '../components/student/MapView';
import ReviewForm from '../components/student/ReviewForm';
import Loader from '../components/common/Loader';
import api from '../utils/api';
import { formatPrice, generateWhatsAppLink, getRatingColor } from '../utils/helpers';
import toast from 'react-hot-toast';
// 🐞 CRITICAL FIX: Corrected import path from 'AuthAuthContext' to 'AuthContext'
import { useAuth } from '../context/AuthContext'; 

const ListingDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchListingDetails();
    fetchReviews();
    // ⚠️ TODO: Fetch saved status for the current user and listing
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      setListing(data.listing);
    } catch (error) {
      toast.error('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/listing/${id}`);
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false); // Close the form on success
    fetchReviews();
    fetchListingDetails();
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in your boarding listing: ${listing.title}`;
    const whatsappUrl = generateWhatsAppLink(listing.contactInfo.whatsapp, message);
    window.open(whatsappUrl, '_blank');
  };

  // ✅ CORRECTED: Improved the Google Maps URL construction
  const handleGetDirections = () => {
    const { lat, lng } = listing.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`; 
    window.open(url, '_blank');
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save listings');
      return;
    }

    try {
      if (isSaved) {
        await api.delete(`/students/saved-listings/${listing._id}`);
        setIsSaved(false);
        toast.success('Removed from saved listings');
      } else {
        await api.post(`/students/saved-listings/${listing._id}`);
        setIsSaved(true);
        toast.success('Added to saved listings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Listing not found
          </h2>
          <Link to="/listings" className="text-primary-600 hover:text-primary-700">
            Back to listings
          </Link>
        </div>
        <AnimatePresence>
          {showReviewForm && (
            <ReviewForm
              listingId={id}
              onClose={() => setShowReviewForm(false)}
              onSuccess={handleReviewSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/listings"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  className="h-96"
                >
                  {listing.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.url}
                        alt={`${listing.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Details Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="w-5 h-5 mr-2" />
                      <span>{listing.location.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        listing.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {listing.status === 'available' ? 'Available' : 'Rented'}
                    </span>
                    {isAuthenticated && user?.role === 'student' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <FiHeart
                          className={`w-5 h-5 ${
                            isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'
                          }`}
                        />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Price and Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <span className="text-4xl font-bold text-primary-600">
                      {formatPrice(listing.price)}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
                      {listing.roomType}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
                      {listing.gender}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full font-medium flex items-center">
                      <FiMapPin className="w-3 h-3 mr-1" />
                      {listing.distance} km away
                    </span>
                  </div>

                  {listing.totalReviews > 0 && (
                    <div className="flex items-center">
                      <FiStar className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                      <span className={`text-lg font-semibold ${getRatingColor(listing.averageRating)}`}>
                        {listing.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-600 ml-1">
                        ({listing.totalReviews} {listing.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Description
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Amenities */}
                {listing.amenities && listing.amenities.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Amenities
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {listing.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center text-gray-700"
                        >
                          <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules */}
                {listing.rules && listing.rules.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      House Rules
                    </h2>
                    <ul className="space-y-2">
                      {listing.rules.map((rule, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <FiX className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Map */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Location
                  </h2>
                  <MapView
                    coordinates={listing.location.coordinates}
                    title={listing.title}
                    address={listing.location.address}
                  />
                  <button
                    onClick={handleGetDirections}
                    className="mt-4 w-full btn-outline flex items-center justify-center gap-2"
                  >
                    <FiMapPin className="w-5 h-5" />
                    Get Directions
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Student Reviews ({reviews.length})
                  </h2>
                  {isAuthenticated && user?.role === 'student' && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiStar className="w-4 h-4" />
                      Write a Review
                    </button>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                              {review.student.firstName[0]}
                              {review.student.lastName[0]}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.student.firstName} {review.student.lastName}
                              </h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {/* ✅ FIXED: Adjusted margin to align comment below avatar container */}
                        <p className="text-gray-700 ml-13 md:ml-14">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Contact Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Owner
                </h3>

                {listing.landlord?.name && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Property Owner</p>
                    <p className="font-semibold text-gray-900">
                      {listing.landlord.name}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Contact via WhatsApp
                  </motion.button>

                  {/* ✅ FIXED: Added missing <a> tag */}
                  {listing.contactInfo.phone && (
                    <a 
                      href={`tel:${listing.contactInfo.phone}`}
                      className="w-full flex items-center justify-center gap-2 btn-outline"
                    >
                      <FiPhone className="w-5 h-5" />
                      {listing.contactInfo.phone}
                    </a>
                  )}

                  {/* ✅ FIXED: Added missing <a> tag */}
                  {listing.contactInfo.email && (
                    <a
                      href={`mailto:${listing.contactInfo.email}`}
                      className="w-full flex items-center justify-center gap-2 btn-outline"
                    >
                      <FiMail className="w-5 h-5" />
                      Send Email
                    </a>
                  )}
                </div>

                {/* Quick Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Quick Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <FiEye className="w-4 h-4 mr-1" />
                        Views
                      </span>
                      <span className="font-medium text-gray-900">{listing.views}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        Listed
                      </span>
                      <span className="font-medium text-gray-900">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">City</span>
                      <span className="font-medium text-gray-900">
                        {listing.location.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Safety Notice */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Safety Tips:</strong> Always verify the property before making any payments. Meet in person and inspect the accommodation thoroughly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            listingId={id}
            onClose={() => setShowReviewForm(false)}
            onSuccess={handleReviewSuccess}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default ListingDetails;