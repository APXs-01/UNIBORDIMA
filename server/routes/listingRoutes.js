const express = require('express');
const router = express.Router();
const {
  getAllListings,
  searchListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
} = require('../controllers/listingController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllListings);
router.get('/search', searchListings);
router.get('/:id', getListingById);
router.post('/', protect, adminOnly, upload.array('images', 10), createListing);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateListing);
router.delete('/:id', protect, adminOnly, deleteListing);

module.exports = router;