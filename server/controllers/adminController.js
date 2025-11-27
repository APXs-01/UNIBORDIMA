const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const Listing = require('../models/Listing');
    const Student = require('../models/Student');
    const Review = require('../models/Review');

    const [
      totalListings,
      availableListings,
      rentedListings,
      totalStudents,
      totalReviews,
      recentListings
    ] = await Promise.all([
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'available' }),
      Listing.countDocuments({ status: 'rented' }),
      Student.countDocuments(),
      Review.countDocuments(),
      Listing.find().sort('-createdAt').limit(5).populate('createdBy', 'username')
    ]);

    res.json({
      success: true,
      stats: {
        totalListings,
        availableListings,
        rentedListings,
        totalStudents,
        totalReviews,
        recentListings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password').sort('-createdAt');
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};