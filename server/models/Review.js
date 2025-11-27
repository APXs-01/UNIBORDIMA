const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews
reviewSchema.index({ listing: 1, student: 1 }, { unique: true });

// Update listing average rating after save
reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRatings(this.listing);
});

// Update listing average rating after remove
reviewSchema.post('remove', async function() {
  await this.constructor.calcAverageRatings(this.listing);
});

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function(listingId) {
  const stats = await this.aggregate([
    {
      $match: { listing: listingId, isApproved: true }
    },
    {
      $group: {
        _id: '$listing',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Listing').findByIdAndUpdate(listingId, {
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = mongoose.model('Review', reviewSchema);