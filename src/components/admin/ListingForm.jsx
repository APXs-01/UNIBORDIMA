import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUpload } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ListingForm = ({ listing, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    roomType: 'Single',
    gender: 'Mixed',
    address: '',
    city: '',
    lat: '',
    lng: '',
    distance: '',
    amenities: [],
    rules: [],
    whatsapp: '',
    phone: '',
    email: '',
    landlordName: '',
    landlordContact: '',
  });

  const amenitiesList = [
    'WiFi',
    'Parking',
    'Kitchen',
    'Laundry',
    'AC',
    'Heating',
    'Gym',
    'Study Room',
    'Common Area',
  ];

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        roomType: listing.roomType,
        gender: listing.gender,
        address: listing.location.address,
        city: listing.location.city,
        lat: listing.location.coordinates.lat,
        lng: listing.location.coordinates.lng,
        distance: listing.distance,
        amenities: listing.amenities,
        rules: listing.rules,
        whatsapp: listing.contactInfo.whatsapp,
        phone: listing.contactInfo.phone || '',
        email: listing.contactInfo.email || '',
        landlordName: listing.landlord?.name || '',
        landlordContact: listing.landlord?.contact || '',
      });
      setImagePreview(listing.images.map((img) => img.url));
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...previews]);
  };

  const removeImage = (index) => {
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('roomType', formData.roomType);
      submitData.append('gender', formData.gender);
      submitData.append('distance', formData.distance);
      
      // Location object
      submitData.append('location[address]', formData.address);
      submitData.append('location[city]', formData.city);
      submitData.append('location[coordinates][lat]', formData.lat);
      submitData.append('location[coordinates][lng]', formData.lng);
      
      // Contact info
      submitData.append('contactInfo[whatsapp]', formData.whatsapp);
      submitData.append('contactInfo[phone]', formData.phone);
      submitData.append('contactInfo[email]', formData.email);
      
      // Landlord info
      submitData.append('landlord[name]', formData.landlordName);
      submitData.append('landlord[contact]', formData.landlordContact);
      
      // Amenities and rules
      formData.amenities.forEach((amenity) => {
        submitData.append('amenities[]', amenity);
      });
      formData.rules.forEach((rule) => {
        submitData.append('rules[]', rule);
      });
      
      // Images
      const imageInput = document.querySelector('input[type="file"]');
      if (imageInput.files.length > 0) {
        Array.from(imageInput.files).forEach((file) => {
          submitData.append('images', file);
        });
      }

      if (listing) {
        await api.put(`/listings/${listing._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Listing updated successfully!');
      } else {
        await api.post('/listings', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Listing created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {listing ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Cozy Single Room near University"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="input-field"
                  placeholder="Describe the boarding place..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (LKR/month) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance from University (km) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="Single">Single</option>
                  <option value="Shared">Shared</option>
                  <option value="Studio">Studio</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="123 Main Street, Malabe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Malabe"
                />
              </div>

              <div></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="6.9147"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="79.9729"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="+94771234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+94112345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="owner@example.com"
                />
              </div>

              <div></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landlord Name
                </label>
                <input
                  type="text"
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landlord Contact
                </label>
                <input
                  type="text"
                  name="landlordContact"
                  value={formData.landlordContact}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+94771234567"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB (max 10 images)
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner border-white mr-2"></div>
                  {listing ? 'Updating...' : 'Creating...'}
                </div>
              ) : listing ? (
                'Update Listing'
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ListingForm;