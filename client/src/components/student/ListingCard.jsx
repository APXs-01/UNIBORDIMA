import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiHeart, FiStar, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { formatPrice, generateWhatsAppLink } from '../../utils/helpers';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ListingCard = ({ listing }) => {
  const { isAuthenticated, user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi, I'm interested in your boarding listing: ${listing.title}`;
    const whatsappUrl = generateWhatsAppLink(listing.contactInfo.whatsapp, message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/listings/${listing._id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={listing.images[0]?.url || '/placeholder.jpg'}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                listing.status === 'available'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {listing.status === 'available' ? 'Available' : 'Rented'}
            </span>
          </div>

          {/* Save Button */}
          {isAuthenticated && user?.role === 'student' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
            >
              <FiHeart
                className={`w-5 h-5 ${
                  isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </motion.button>
          )}

          {/* Room Type Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-black bg-opacity-70 text-white rounded-full text-xs font-medium">
              {listing.roomType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{listing.location.address}</span>
          </div>

          {/* Distance & Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">{listing.distance} km</span>
              <span className="mx-1">•</span>
              <span>{listing.gender}</span>
            </div>

            {listing.totalReviews > 0 && (
              <div className="flex items-center">
                <FiStar className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  {listing.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({listing.totalReviews})
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(listing.price)}
              </span>
              <span className="text-gray-600 text-sm">/month</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Contact Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span className="text-sm font-medium">WhatsApp</span>
            </motion.button>

            <Link
              to={`/listings/${listing._id}`}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <span className="text-sm font-medium">View Details</span>
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ListingCard;