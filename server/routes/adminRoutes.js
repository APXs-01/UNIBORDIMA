const express = require('express');
const router = express.Router();
const {
  login,
  getDashboardStats,
  getAllStudents
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/login', login);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/students', protect, adminOnly, getAllStudents);

module.exports = router;