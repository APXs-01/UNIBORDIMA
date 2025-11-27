const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  saveListing,
  removeSavedListing
} = require('../controllers/studentController');
const { protect, studentOnly } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, studentOnly, getMe);
router.put('/profile', protect, studentOnly, updateProfile);
router.post('/saved-listings/:listingId', protect, studentOnly, saveListing);
router.delete('/saved-listings/:listingId', protect, studentOnly, removeSavedListing);

module.exports = router;