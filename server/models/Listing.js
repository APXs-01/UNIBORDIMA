const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  amenities: [{
    type: String,
    enum: ['WiFi', 'Parking', 'Kitchen', 'Laundry', 'AC', 'Heating', 'Gym', 'Study Room', 'Common Area']
  }],
  rules: [String],
  roomType: {
    type: String,
    enum: ['Single', 'Shared', 'Studio', 'Apartment'],
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Mixed'],
    required: true
  },
  distance: {
    type: Number,
    required: [true, 'Distance from university is required']
  },
  contactInfo: {
    whatsapp: {
      type: String,
      required: true
    },
    phone: String,
    email: String
  },
  landlord: {
    name: String,
    contact: String
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'pending'],
    default: 'available'
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for search optimization
listingSchema.index({ title: 'text', description: 'text', 'location.address': 'text' });
listingSchema.index({ 'location.coordinates': '2dsphere' });
listingSchema.index({ price: 1, distance: 1 });

// Virtual for reviews
listingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listing'
});

module.exports = mongoose.model('Listing', listingSchema);