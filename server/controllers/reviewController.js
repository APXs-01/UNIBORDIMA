const Review = require('../models/Review');
const Listing = require('../models/Listing');

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
exports.getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      listing: req.params.listingId,
      isApproved: true
    })
      .populate('student', 'firstName lastName profilePicture')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private/Student
exports.createReview = async (req, res) => {
  try {
    const { listing, rating, comment } = req.body;

    // Check if listing exists
    const listingExists = await Listing.findById(listing);
    if (!listingExists) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if student already reviewed
    const existingReview = await Review.findOne({
      listing,
      student: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this listing' });
    }

    const review = await Review.create({
      listing,
      student: req.user.id,
      rating,
      comment
    });

    await review.populate('student', 'firstName lastName profilePicture');

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Student
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'firstName lastName profilePicture');

    res.json({ success: true, review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Student or Admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership or admin
    if (review.student.toString() !== req.user.id && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.remove();

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('student', 'firstName lastName email')
      .populate('listing', 'title')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Moderate review (approve/reject)
// @route   PUT /api/reviews/:id/moderate
// @access  Private/Admin
exports.moderateReview = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('student', 'firstName lastName');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};