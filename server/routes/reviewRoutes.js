const express = require('express');
const router = express.Router();
const {
  getListingReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  moderateReview
} = require('../controllers/reviewController');
const { protect, studentOnly, adminOnly } = require('../middleware/auth');

router.get('/listing/:listingId', getListingReviews);
router.post('/', protect, studentOnly, createReview);
router.put('/:id', protect, studentOnly, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/moderate', protect, adminOnly, moderateReview);

module.exports = router;